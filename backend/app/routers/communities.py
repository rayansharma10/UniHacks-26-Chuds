from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter(prefix="/communities", tags=["communities"])

def seed_communities(db: Session):
    communities = [
        {"slug": "parramatta",  "name": "Parramatta",  "type": "suburb", "icon": "🏙️"},
        {"slug": "unsw",        "name": "UNSW",        "type": "school", "icon": "🎓"},
        {"slug": "sydney",      "name": "Sydney",      "type": "city",   "icon": "🌆"},
        {"slug": "carlingford", "name": "Carlingford", "type": "suburb", "icon": "🏘️"},
    ]
    
    for c_data in communities:
        existing = db.query(models.Community).filter(models.Community.slug == c_data["slug"]).first()
        if not existing:
            new_c = models.Community(**c_data)
            db.add(new_c)
    db.commit()

@router.get("")
def list_communities(db: Session = Depends(get_db)):
    # Simple seeding on list if empty
    count = db.query(models.Community).count()
    if count == 0:
        seed_communities(db)
        
    return db.query(models.Community).all()

@router.get("/{slug}")
def get_community(slug: str, db: Session = Depends(get_db)):
    return db.query(models.Community).filter(models.Community.slug == slug).first()
