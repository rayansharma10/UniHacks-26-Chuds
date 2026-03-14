from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel
from app.services.database import get_session
from app.services.models import User
from app.services.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth")


class RegisterBody(BaseModel):
    username: str
    email: str
    password: str


@router.post("/register", status_code=201)
def register(body: RegisterBody, session: Session = Depends(get_session)):
    if session.exec(select(User).where(User.username == body.username)).first():
        raise HTTPException(400, "Username already taken")
    if session.exec(select(User).where(User.email == body.email)).first():
        raise HTTPException(400, "Email already registered")
    user = User(username=body.username, email=body.email, password_hash=hash_password(body.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "username": user.username}


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form.username)).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(user.username), "token_type": "bearer"}
