from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.services.database import get_session
from app.services.models import Comment, Dilemma, User
from app.services.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    dilemma_id: int
    user_id: int
    username: str
    content: str
    created_at: datetime


@router.get("/dilemmas/{dilemma_id}/comments", response_model=list[CommentOut])
def get_comments(dilemma_id: int, session: Session = Depends(get_session)):
    if not session.get(Dilemma, dilemma_id):
        raise HTTPException(status_code=404, detail="Dilemma not found")
    comments = session.exec(
        select(Comment)
        .where(Comment.dilemma_id == dilemma_id)
        .order_by(Comment.created_at.asc())
    ).all()
    result = []
    for c in comments:
        user = session.get(User, c.user_id)
        result.append(CommentOut(
            id=c.id,
            dilemma_id=c.dilemma_id,
            user_id=c.user_id,
            username=user.username if user else "unknown",
            content=c.content,
            created_at=c.created_at,
        ))
    return result


@router.post("/dilemmas/{dilemma_id}/comments", response_model=CommentOut, status_code=201)
def post_comment(
    dilemma_id: int,
    body: CommentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not session.get(Dilemma, dilemma_id):
        raise HTTPException(status_code=404, detail="Dilemma not found")
    comment = Comment(user_id=current_user.id, dilemma_id=dilemma_id, content=body.content)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return CommentOut(
        id=comment.id,
        dilemma_id=comment.dilemma_id,
        user_id=comment.user_id,
        username=current_user.username,
        content=comment.content,
        created_at=comment.created_at,
    )
