import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, migrate_database, SessionLocal
from .routers import auth, users, dilemmas, communities

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Run migrations
migrate_database()

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Seed communities on startup
def seed_communities_on_startup():
    """Seed communities when the application starts"""
    try:
        db = SessionLocal()
        try:
            from . import models
            from .routers.communities import seed_communities
            count = db.query(models.Community).count()
            if count == 0:
                logger.info("Seeding communities on startup...")
                seed_communities(db)
            else:
                logger.info(f"Found {count} existing communities, skipping seed")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error seeding communities on startup: {str(e)}")
        # Don't fail startup if seeding fails

seed_communities_on_startup()

app = FastAPI(title="Parallel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dilemmas.router)
app.include_router(communities.router)

@app.get("/")
def health():
    return {"status": "ok"}
