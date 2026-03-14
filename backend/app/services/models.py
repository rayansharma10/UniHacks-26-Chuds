from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class UserCommunityLink(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)
    community_id: Optional[int] = Field(default=None, foreign_key="community.id", primary_key=True)


class DilemmaCommunitLink(SQLModel, table=True):
    dilemma_id: Optional[int] = Field(default=None, foreign_key="dilemma.id", primary_key=True)
    community_id: Optional[int] = Field(default=None, foreign_key="community.id", primary_key=True)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    points: int = Field(default=0)
    season_rank: Optional[int] = None

    dilemmas: List["Dilemma"] = Relationship(back_populates="user")
    votes: List["Vote"] = Relationship(back_populates="user")
    comments: List["Comment"] = Relationship(back_populates="user")
    communities: List["Community"] = Relationship(back_populates="members", link_model=UserCommunityLink)


class Community(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    type: str  # "suburb" | "school" | "work" | "club"
    members_count: int = Field(default=0)
    icon: Optional[str] = None

    members: List[User] = Relationship(back_populates="communities", link_model=UserCommunityLink)
    dilemmas: List["Dilemma"] = Relationship(back_populates="communities", link_model=DilemmaCommunitLink)


class Dilemma(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    category: str  # "personal" | "community" | "civic"
    content: str
    image_url: Optional[str] = None
    outcome: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="dilemmas")
    votes: List["Vote"] = Relationship(back_populates="dilemma")
    comments: List["Comment"] = Relationship(back_populates="dilemma")
    communities: List[Community] = Relationship(back_populates="dilemmas", link_model=DilemmaCommunitLink)


class Vote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    dilemma_id: int = Field(foreign_key="dilemma.id")
    choice: str  # "yes" | "no"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="votes")
    dilemma: Optional[Dilemma] = Relationship(back_populates="votes")


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    dilemma_id: int = Field(foreign_key="dilemma.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="comments")
    dilemma: Optional[Dilemma] = Relationship(back_populates="comments")
