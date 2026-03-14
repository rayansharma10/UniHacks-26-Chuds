from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String
from typing import Optional, List
from datetime import datetime


class UserCommunityLink(SQLModel, table=True):
    __tablename__ = "usercommunitylink"
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", primary_key=True)
    community_id: Optional[int] = Field(default=None, foreign_key="communities.id", primary_key=True)


class DilemmaCommunitLink(SQLModel, table=True):
    __tablename__ = "dilemmacommunitlink"
    dilemma_id: Optional[int] = Field(default=None, foreign_key="dilemmas.id", primary_key=True)
    community_id: Optional[int] = Field(default=None, foreign_key="communities.id", primary_key=True)


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: Optional[str] = Field(default=None, sa_column=Column("password", String))
    points: int = Field(default=0)
    season_rank: Optional[int] = None

    dilemmas: List["Dilemma"] = Relationship(back_populates="user")
    votes: List["Vote"] = Relationship(back_populates="user")
    comments: List["Comment"] = Relationship(back_populates="user")
    communities: List["Community"] = Relationship(back_populates="members", link_model=UserCommunityLink)


class Community(SQLModel, table=True):
    __tablename__ = "communities"
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    type: str  # "suburb" | "school" | "work" | "club"
    members_count: int = Field(default=0)
    icon: Optional[str] = None

    members: List[User] = Relationship(back_populates="communities", link_model=UserCommunityLink)
    dilemmas: List["Dilemma"] = Relationship(back_populates="communities", link_model=DilemmaCommunitLink)


class Dilemma(SQLModel, table=True):
    __tablename__ = "dilemmas"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
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
    __tablename__ = "votes"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    dilemma_id: int = Field(foreign_key="dilemmas.id")
    choice: str  # "yes" | "no"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="votes")
    dilemma: Optional[Dilemma] = Relationship(back_populates="votes")


class Comment(SQLModel, table=True):
    __tablename__ = "comments"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    dilemma_id: int = Field(foreign_key="dilemmas.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="comments")
    dilemma: Optional[Dilemma] = Relationship(back_populates="comments")
