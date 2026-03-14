from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.services.database import get_session
from app.services.models import User
from app.services.auth import get_current_user
import os

router = APIRouter()

ADMIN_USERNAMES = set(os.getenv("ADMIN_USERNAMES", "").split(","))


def is_admin_user(user: User) -> bool:
    return user.username in ADMIN_USERNAMES


@router.get("/users/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "points": current_user.points,
        "season_rank": current_user.season_rank,
        "is_admin": is_admin_user(current_user),
    }


@router.get("/users/leaderboard")
def leaderboard(session: Session = Depends(get_session)):
    users = session.exec(select(User).order_by(User.points.desc()).limit(20)).all()
    return [{"id": u.id, "username": u.username, "points": u.points, "season_rank": u.season_rank} for u in users]
