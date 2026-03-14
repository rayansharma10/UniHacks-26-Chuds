import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# Railway provides postgres:// but SQLAlchemy needs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def migrate_database():
    """Add missing columns to existing tables"""
    try:
        with engine.connect() as conn:
            # Check if image_url column exists in dilemmas table
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'dilemmas' AND column_name = 'image_url'
            """))
            if not result.fetchone():
                # Add the column
                conn.execute(text("""
                    ALTER TABLE dilemmas ADD COLUMN image_url VARCHAR
                """))
                conn.commit()
                print("Added image_url column to dilemmas table")
    except Exception as e:
        print(f"Migration error: {e}")
        # Don't raise error to avoid crashing the app

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
