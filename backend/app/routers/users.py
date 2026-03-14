from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from .. import models

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "points": current_user.points,
        "season_rank": current_user.season_rank,
    }

@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.points.desc()).limit(20).all()
    return [{"id": u.id, "username": u.username, "points": u.points, "season_rank": u.season_rank} for u in users]
