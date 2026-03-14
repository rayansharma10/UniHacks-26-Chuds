import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database import get_db
from .. import models
from ..auth import hash_password, verify_password, create_access_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterBody(BaseModel):
    username: str
    email: EmailStr
    password: str

@router.post("/register", status_code=201)
def register(body: RegisterBody, db: Session = Depends(get_db)):
    if len(body.password.encode()) > 72:
        raise HTTPException(400, "Password too long (max 72 characters)")
    try:
        if db.query(models.User).filter(models.User.username == body.username).first():
            raise HTTPException(400, "Username already taken")
        if db.query(models.User).filter(models.User.email == body.email).first():
            raise HTTPException(400, "Email already registered")
        user = models.User(username=body.username, email=body.email, password=hash_password(body.password))
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"id": user.id, "username": user.username}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Register error: {e}")
        db.rollback()
        raise HTTPException(500, f"Registration failed: {str(e)}")

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form.username).first()
    if not user or not verify_password(form.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}
