from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id          = Column(Integer, primary_key=True, index=True)
    username    = Column(String, unique=True, index=True, nullable=False)
    email       = Column(String, unique=True, index=True, nullable=False)
    password    = Column(String, nullable=False)
    points      = Column(Integer, default=0)
    season_rank = Column(Integer, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # Cascade deletes so removing a user also removes their content
    dilemmas = relationship("Dilemma", back_populates="author", cascade="all, delete-orphan")
    votes    = relationship("Vote", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

class Community(Base):
    __tablename__ = "communities"
    id          = Column(Integer, primary_key=True, index=True)
    slug        = Column(String, unique=True, index=True, nullable=False)
    name        = Column(String, nullable=False)
    type        = Column(String, nullable=False)
    icon        = Column(String, nullable=True)
    members     = Column(Integer, default=0)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    dilemmas = relationship("Dilemma", back_populates="community")

class Dilemma(Base):
    __tablename__ = "dilemmas"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="SET NULL"), nullable=True)
    content      = Column(Text, nullable=False)
    category     = Column(String, nullable=False)  # personal | community | civic
    outcome      = Column(Text, nullable=True)
    image_url    = Column(String, nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    author    = relationship("User", back_populates="dilemmas")
    community = relationship("Community", back_populates="dilemmas")
    votes     = relationship("Vote", back_populates="dilemma", cascade="all, delete-orphan")
    comments  = relationship("Comment", back_populates="dilemma", cascade="all, delete-orphan")

class Vote(Base):
    __tablename__ = "votes"
    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    dilemma_id    = Column(Integer, ForeignKey("dilemmas.id", ondelete="CASCADE"), nullable=False)
    choice        = Column(String, nullable=False)  # yes | no
    points_earned = Column(Integer, default=10)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    user    = relationship("User", back_populates="votes")
    dilemma = relationship("Dilemma", back_populates="votes")

class Comment(Base):
    __tablename__ = "comments"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    dilemma_id = Column(Integer, ForeignKey("dilemmas.id", ondelete="CASCADE"), nullable=False)
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user    = relationship("User", back_populates="comments")
    dilemma = relationship("Dilemma", back_populates="comments")
