from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./parallel.db")

# Railway Postgres URLs start with postgres://, SQLAlchemy needs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    from app.services.models import User, Dilemma, Vote, Comment, Community, UserCommunityLink, DilemmaCommunitLink  # noqa: F401
    SQLModel.metadata.create_all(engine)
    # Safely add image_url if it doesn't exist (works on both SQLite and Postgres)
    from sqlalchemy import text, inspect
    inspector = inspect(engine)
    if 'dilemma' in inspector.get_table_names():
        existing = {col['name'] for col in inspector.get_columns('dilemma')}
        if 'image_url' not in existing:
            with engine.connect() as conn:
                conn.execute(text('ALTER TABLE dilemma ADD COLUMN image_url VARCHAR'))
                conn.commit()


def get_session():
    with Session(engine) as session:
        yield session
