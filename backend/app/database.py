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
    """Add missing columns/tables to existing database"""
    try:
        with engine.connect() as conn:
            # Check if image_url column exists in dilemmas table
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'dilemmas' AND column_name = 'image_url'
            """))
            if not result.fetchone():
                conn.execute(text("ALTER TABLE dilemmas ADD COLUMN image_url VARCHAR"))
                conn.commit()
                print("Added image_url column to dilemmas table")

            # Create communities table if it doesn't exist
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS communities (
                    id SERIAL PRIMARY KEY,
                    slug VARCHAR UNIQUE NOT NULL,
                    name VARCHAR NOT NULL,
                    type VARCHAR NOT NULL,
                    icon VARCHAR,
                    members INTEGER DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            """))
            conn.commit()
            print("Ensured communities table exists")

            # Add community_id to dilemmas if missing
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'dilemmas' AND column_name = 'community_id'
            """))
            if not result.fetchone():
                conn.execute(text("""
                    ALTER TABLE dilemmas
                    ADD COLUMN community_id INTEGER REFERENCES communities(id) ON DELETE SET NULL
                """))
                conn.commit()
                print("Added community_id column to dilemmas table")

    except Exception as e:
        print(f"Migration error: {e}")
        # Don't raise error to avoid crashing the app

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
