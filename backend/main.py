import os
os.makedirs("uploads", exist_ok=True)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import users, decisions, comments, votes, leaderboard, about, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # NOTE: do NOT call create_db_and_tables() here — that used the legacy
    # SQLModel stack and created orphan tables. Schema is managed by app/main.py.
    yield


app = FastAPI(title="Parallel API", version="1.0.0", lifespan=lifespan)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(decisions.router)
app.include_router(comments.router)
app.include_router(votes.router)
app.include_router(leaderboard.router)
app.include_router(about.router)
