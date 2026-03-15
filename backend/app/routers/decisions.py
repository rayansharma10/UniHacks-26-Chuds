from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select, func
from app.services.database import get_session
from app.services.models import Dilemma, Vote, User, Community, DilemmaCommunitLink, Comment
from app.services.auth import get_current_user, get_current_user_optional
from pydantic import BaseModel
from botocore.client import Config
from typing import Optional
from datetime import datetime
import uuid, os, logging

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_BUCKET     = os.getenv("R2_BUCKET_NAME", "unihacks26")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "https://pub-9fa2791652c34967a1ec484b309e7fe9.r2.dev")

def upload_to_r2(data: bytes, key: str, content_type: str) -> str:
    import boto3
    from botocore.exceptions import ClientError
    s3 = boto3.client(
        's3',
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        region_name='auto',
        config=Config(signature_version='s3v4')
    )
    s3.put_object(Bucket=R2_BUCKET, Key=key, Body=data, ContentType=content_type)
    return f"{R2_PUBLIC_URL}/{key}"

router = APIRouter()


class DilemmaCreate(BaseModel):
    content: str
    category: str


class VoteCreate(BaseModel):
    choice: str  # "yes" | "no"


class DilemmaOut(BaseModel):
    id: int
    user_id: int
    username: str
    category: str
    content: str
    image_url: Optional[str]
    votes_yes: int
    votes_no: int
    user_vote: Optional[str]  # "yes" | "no" | None
    outcome: Optional[str]
    created_at: datetime


class VoteOut(BaseModel):
    points_earned: int
    dilemma: DilemmaOut


def _enrich(dilemma: Dilemma, session: Session, current_user: Optional[User] = None) -> DilemmaOut:
    yes = session.exec(
        select(func.count(Vote.id)).where(Vote.dilemma_id == dilemma.id, Vote.choice == "yes")
    ).one()
    no = session.exec(
        select(func.count(Vote.id)).where(Vote.dilemma_id == dilemma.id, Vote.choice == "no")
    ).one()
    user = session.get(User, dilemma.user_id)
    user_vote = None
    if current_user:
        existing = session.exec(
            select(Vote).where(Vote.user_id == current_user.id, Vote.dilemma_id == dilemma.id)
        ).first()
        user_vote = existing.choice if existing else None
    # Fix legacy /uploads/ paths to use R2 public URL
    img = dilemma.image_url
    if img and img.startswith("/uploads/"):
        img = f"{R2_PUBLIC_URL}{img}"
    return DilemmaOut(
        id=dilemma.id,
        user_id=dilemma.user_id,
        username=user.username if user else "unknown",
        category=dilemma.category,
        content=dilemma.content,
        image_url=img,
        votes_yes=yes,
        votes_no=no,
        user_vote=user_vote,
        outcome=dilemma.outcome,
        created_at=dilemma.created_at,
    )


@router.get("/dilemmas", response_model=list[DilemmaOut])
def get_dilemmas(
    category: Optional[str] = None,
    community: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    q = select(Dilemma).order_by(Dilemma.created_at.desc())
    if category:
        q = q.where(Dilemma.category == category)
    if community:
        comm = session.exec(select(Community).where(Community.slug == community)).first()
        if comm:
            links = session.exec(select(DilemmaCommunitLink).where(DilemmaCommunitLink.community_id == comm.id)).all()
            ids = [l.dilemma_id for l in links]
            q = q.where(Dilemma.id.in_(ids))
        else:
            return []
    dilemmas = session.exec(q).all()
    return [_enrich(d, session, current_user) for d in dilemmas]


@router.get("/dilemmas/mine", response_model=list[DilemmaOut])
def get_my_dilemmas(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    dilemmas = session.exec(
        select(Dilemma)
        .where(Dilemma.user_id == current_user.id)
        .order_by(Dilemma.created_at.desc())
    ).all()
    return [_enrich(d, session, current_user) for d in dilemmas]


@router.post("/dilemmas", response_model=DilemmaOut, status_code=201)
async def create_dilemma(
    content: str = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        key = f"dilemmas/{uuid.uuid4().hex}{ext}"
        data = await image.read()
        try:
            image_url = upload_to_r2(data, key, image.content_type or "image/jpeg")
        except Exception as e:
            logging.error(f"R2 upload failed: {e}")
            raise HTTPException(500, f"Image upload failed: {e}")
    dilemma = Dilemma(user_id=current_user.id, content=content, category=category, image_url=image_url)
    session.add(dilemma)
    session.commit()
    session.refresh(dilemma)
    return _enrich(dilemma, session)


@router.delete("/dilemmas/{dilemma_id}")
def delete_dilemma(
    dilemma_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    dilemma = session.get(Dilemma, dilemma_id)
    if not dilemma:
        raise HTTPException(status_code=404, detail="Dilemma not found")
    if dilemma.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your dilemma")
    for vote in session.exec(select(Vote).where(Vote.dilemma_id == dilemma_id)).all():
        session.delete(vote)
    for comment in session.exec(select(Comment).where(Comment.dilemma_id == dilemma_id)).all():
        session.delete(comment)
    session.delete(dilemma)
    session.commit()
    return {"ok": True}


@router.post("/dilemmas/{dilemma_id}/vote", response_model=VoteOut)
def vote(
    dilemma_id: int,
    body: VoteCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    dilemma = session.get(Dilemma, dilemma_id)
    if not dilemma:
        raise HTTPException(status_code=404, detail="Dilemma not found")
    if body.choice not in ("yes", "no"):
        raise HTTPException(status_code=400, detail="choice must be 'yes' or 'no'")

    existing = session.exec(
        select(Vote).where(Vote.user_id == current_user.id, Vote.dilemma_id == dilemma_id)
    ).first()

    points_earned = 0
    if existing:
        existing.choice = body.choice
        session.add(existing)
    else:
        session.add(Vote(user_id=current_user.id, dilemma_id=dilemma_id, choice=body.choice))
        points_earned = 10
        current_user.points += points_earned
        session.add(current_user)
        all_users = session.exec(select(User).order_by(User.points.desc())).all()
        for i, u in enumerate(all_users):
            u.season_rank = i + 1
            session.add(u)

    session.commit()
    session.refresh(dilemma)
    return VoteOut(points_earned=points_earned, dilemma=_enrich(dilemma, session, current_user))
