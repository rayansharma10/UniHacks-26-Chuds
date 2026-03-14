from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..auth import get_current_user
from .. import models

router = APIRouter(prefix="/dilemmas", tags=["dilemmas"])

class DilemmaBody(BaseModel):
    content: str
    category: str

class VoteBody(BaseModel):
    choice: str  # yes | no

class OutcomeBody(BaseModel):
    outcome: str

def fmt(d: models.Dilemma):
    yes = sum(1 for v in d.votes if v.choice == "yes")
    no  = sum(1 for v in d.votes if v.choice == "no")
    return {
        "id": d.id,
        "user_id": d.user_id,
        "username": d.author.username,
        "content": d.content,
        "category": d.category,
        "outcome": d.outcome,
        "votes_yes": yes,
        "votes_no": no,
        "created_at": d.created_at.isoformat(),
    }

@router.get("")
def list_dilemmas(category: Optional[str] = None, community: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Dilemma)
    if category:
        q = q.filter(models.Dilemma.category == category)
    dilemmas = q.order_by(models.Dilemma.created_at.desc()).all()
    return [fmt(d) for d in dilemmas]

@router.get("/mine")
def my_dilemmas(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    dilemmas = db.query(models.Dilemma).filter(models.Dilemma.user_id == current_user.id).order_by(models.Dilemma.created_at.desc()).all()
    return [fmt(d) for d in dilemmas]

@router.post("", status_code=201)
def create_dilemma(content: str = Form(...), category: str = Form(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    d = models.Dilemma(user_id=current_user.id, content=content, category=category)
    db.add(d)
    db.commit()
    db.refresh(d)
    return fmt(d)

@router.post("/{dilemma_id}/vote")
def vote(dilemma_id: int, body: VoteBody, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    d = db.query(models.Dilemma).filter(models.Dilemma.id == dilemma_id).first()
    if not d:
        raise HTTPException(404, "Dilemma not found")
    existing = db.query(models.Vote).filter_by(user_id=current_user.id, dilemma_id=dilemma_id).first()
    if existing:
        raise HTTPException(400, "Already voted")
    vote = models.Vote(user_id=current_user.id, dilemma_id=dilemma_id, choice=body.choice, points_earned=10)
    db.add(vote)
    current_user.points += 10
    db.commit()
    db.refresh(d)
    return {"points_earned": 10, "dilemma": fmt(d)}

@router.patch("/{dilemma_id}/outcome")
def set_outcome(dilemma_id: int, body: OutcomeBody, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    d = db.query(models.Dilemma).filter(models.Dilemma.id == dilemma_id, models.Dilemma.user_id == current_user.id).first()
    if not d:
        raise HTTPException(404, "Not found or not yours")
    d.outcome = body.outcome
    db.commit()
    return fmt(d)

@router.get("/{dilemma_id}/comments")
def get_comments(dilemma_id: int, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).filter(models.Comment.dilemma_id == dilemma_id).order_by(models.Comment.created_at).all()
    return [{"id": c.id, "dilemma_id": c.dilemma_id, "user_id": c.user_id, "username": c.user.username, "content": c.content, "created_at": c.created_at.isoformat()} for c in comments]

@router.post("/{dilemma_id}/comments", status_code=201)
def post_comment(dilemma_id: int, body: dict, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    c = models.Comment(user_id=current_user.id, dilemma_id=dilemma_id, content=body["content"])
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "dilemma_id": c.dilemma_id, "user_id": c.user_id, "username": current_user.username, "content": c.content, "created_at": c.created_at.isoformat()}
