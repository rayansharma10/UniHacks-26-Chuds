import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, migrate_database
from .routers import auth, users, dilemmas, communities

# Run migrations
migrate_database()

# Create all tables on startup
Base.metadata.create_all(bind=engine)

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
