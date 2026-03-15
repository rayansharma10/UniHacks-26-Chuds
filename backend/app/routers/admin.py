from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..auth import hash_password
from .. import models

router = APIRouter(prefix="/admin")


class SeedResponse(BaseModel):
    status: str
    users: int
    communities: int
    dilemmas: int
    comments: int
    votes: int


@router.post("/seed", response_model=SeedResponse)
def seed_database(db: Session = Depends(get_db)):
    """
    Seed the database with fake data about public infrastructure issues.
    Clears existing data and populates with fresh demo data.
    """
    
    # Clear existing data (in order to respect FK constraints)
    db.query(models.Vote).delete()
    db.query(models.Comment).delete()
    db.query(models.Dilemma).delete()
    db.query(models.Community).delete()
    db.query(models.User).delete()
    db.commit()
    
    # Create users
    users_data = [
        {"username": "alex_transit", "email": "alex@example.com", "password": "password123"},
        {"username": "jordan_roads", "email": "jordan@example.com", "password": "password123"},
        {"username": "casey_water", "email": "casey@example.com", "password": "password123"},
        {"username": "morgan_power", "email": "morgan@example.com", "password": "password123"},
        {"username": "sam_infrastructure", "email": "sam@example.com", "password": "password123"},
    ]
    
    users = []
    for user_data in users_data:
        # Truncate password to 72 bytes before hashing (bcrypt limit)
        password = user_data["password"][:72]
        user = models.User(
            username=user_data["username"],
            email=user_data["email"],
            password=hash_password(password),
            points=0
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    for user in users:
        db.refresh(user)
    
    # Create communities
    communities_data = [
        {"slug": "transit", "name": "Public Transit", "type": "suburb"},
        {"slug": "roads", "name": "Roads & Highways", "type": "work"},
        {"slug": "water", "name": "Water Systems", "type": "city"},
        {"slug": "power", "name": "Power Grid", "type": "club"},
    ]
    
    communities = {}
    for comm_data in communities_data:
        community = models.Community(
            slug=comm_data["slug"],
            name=comm_data["name"],
            type=comm_data["type"],
            members=0
        )
        db.add(community)
        communities[comm_data["slug"]] = community
    
    db.commit()
    for comm in communities.values():
        db.refresh(comm)
    
    # Create dilemmas
    dilemmas_data = [
        {
            "content": "Should we prioritize fixing potholes on residential streets or expanding public transit routes?",
            "community": "roads",
            "author_index": 0,
            "category": "civic"
        },
        {
            "content": "Is it better to invest in bus rapid transit or light rail for our city?",
            "community": "transit",
            "author_index": 1,
            "category": "civic"
        },
        {
            "content": "Should aging water infrastructure be replaced all at once or gradually?",
            "community": "water",
            "author_index": 2,
            "category": "civic"
        },
        {
            "content": "Do we need to upgrade the power grid for renewable energy integration?",
            "community": "power",
            "author_index": 3,
            "category": "civic"
        },
        {
            "content": "Should parking be reduced to encourage public transit use?",
            "community": "transit",
            "author_index": 4,
            "category": "civic"
        },
        {
            "content": "Is it worth investing in smart traffic lights to reduce congestion?",
            "community": "roads",
            "author_index": 0,
            "category": "civic"
        },
    ]
    
    dilemmas = []
    for dilemma_data in dilemmas_data:
        dilemma = models.Dilemma(
            user_id=users[dilemma_data["author_index"]].id,
            community_id=communities[dilemma_data["community"]].id,
            content=dilemma_data["content"],
            category=dilemma_data["category"]
        )
        db.add(dilemma)
        dilemmas.append(dilemma)
    
    db.commit()
    for dilemma in dilemmas:
        db.refresh(dilemma)
    
    # Create comments
    comments_data = [
        {"dilemma_index": 0, "user_index": 1, "content": "We really need better infrastructure in residential areas!"},
        {"dilemma_index": 0, "user_index": 2, "content": "Public transit expansion is more sustainable long-term."},
        {"dilemma_index": 1, "user_index": 2, "content": "Light rail is great but buses are more flexible."},
        {"dilemma_index": 1, "user_index": 3, "content": "Either way we need to invest in clean transportation."},
        {"dilemma_index": 2, "user_index": 3, "content": "Gradual replacement allows for budget planning."},
        {"dilemma_index": 2, "user_index": 4, "content": "We can't wait too long on this infrastructure update."},
        {"dilemma_index": 4, "user_index": 0, "content": "Reducing parking will push cars to other neighborhoods."},
        {"dilemma_index": 5, "user_index": 1, "content": "Smart lights could significantly reduce traffic delays."},
    ]
    
    comments = []
    for comment_data in comments_data:
        comment = models.Comment(
            user_id=users[comment_data["user_index"]].id,
            dilemma_id=dilemmas[comment_data["dilemma_index"]].id,
            content=comment_data["content"]
        )
        db.add(comment)
        comments.append(comment)
    
    db.commit()
    for comment in comments:
        db.refresh(comment)
    
    # Create votes
    votes_data = [
        {"dilemma_index": 0, "user_index": 0, "choice": "yes"},
        {"dilemma_index": 0, "user_index": 2, "choice": "no"},
        {"dilemma_index": 1, "user_index": 1, "choice": "yes"},
        {"dilemma_index": 2, "user_index": 3, "choice": "yes"},
        {"dilemma_index": 3, "user_index": 4, "choice": "yes"},
        {"dilemma_index": 4, "user_index": 0, "choice": "no"},
        {"dilemma_index": 5, "user_index": 2, "choice": "yes"},
        {"dilemma_index": 5, "user_index": 3, "choice": "yes"},
    ]
    
    votes = []
    for vote_data in votes_data:
        vote = models.Vote(
            user_id=users[vote_data["user_index"]].id,
            dilemma_id=dilemmas[vote_data["dilemma_index"]].id,
            choice=vote_data["choice"],
            points_earned=10
        )
        db.add(vote)
        votes.append(vote)
    
    db.commit()
    
    return SeedResponse(
        status="success",
        users=len(users),
        communities=len(communities),
        dilemmas=len(dilemmas),
        comments=len(comments),
        votes=len(votes)
    )
