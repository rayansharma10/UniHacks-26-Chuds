from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/communities", tags=["communities"])

def seed_communities(db: Session):
    """Seed communities if they don't exist"""
    try:
        communities = [
            {"slug": "parramatta",  "name": "Parramatta",  "type": "suburb", "icon": "🏙️"},
            {"slug": "unsw",        "name": "UNSW",        "type": "school", "icon": "🎓"},
            {"slug": "sydney",      "name": "Sydney",      "type": "city",   "icon": "🌆"},
            {"slug": "carlingford", "name": "Carlingford", "type": "suburb", "icon": "🏘️"},
        ]
        
        created_count = 0
        for c_data in communities:
            existing = db.query(models.Community).filter(models.Community.slug == c_data["slug"]).first()
            if not existing:
                new_c = models.Community(**c_data)
                db.add(new_c)
                created_count += 1
        
        if created_count > 0:
            db.commit()
            logger.info(f"Seeded {created_count} communities")
        else:
            logger.info("All communities already exist")
            
        return created_count
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding communities: {str(e)}")
        raise

def format_community(community: models.Community):
    """Format community model for JSON response"""
    if not community:
        return None
    return {
        "id": community.id,
        "slug": community.slug,
        "name": community.name,
        "type": community.type,
        "icon": community.icon,
        "members": community.members,
        "created_at": community.created_at.isoformat() if community.created_at else None,
    }

@router.get("")
def list_communities(db: Session = Depends(get_db)):
    """List all communities, seeding if empty"""
    try:
        # Check if communities exist, seed if empty
        count = db.query(models.Community).count()
        if count == 0:
            logger.info("No communities found, seeding...")
            seed_communities(db)
        
        # Fetch all communities
        communities = db.query(models.Community).order_by(models.Community.name).all()
        return [format_community(c) for c in communities]
    except Exception as e:
        logger.error(f"Error listing communities: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to list communities: {str(e)}")

@router.post("/seed")
def force_seed_communities(db: Session = Depends(get_db)):
    """Manually trigger community seeding (useful for Railway/debugging)"""
    try:
        count = seed_communities(db)
        return {"success": True, "message": f"Seeded {count} new communities"}
    except Exception as e:
        logger.error(f"Error in force seed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to seed communities: {str(e)}")

@router.get("/{slug}")
def get_community(slug: str, db: Session = Depends(get_db)):
    """Get a specific community by slug"""
    community = db.query(models.Community).filter(models.Community.slug == slug).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return format_community(community)
