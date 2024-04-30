from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base
from typing import Optional

#user model for creating user table in database
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

    posts = relationship("BlogPost", back_populates="author")
    
    class Config:
        from_attributes = True

#user model for creating post table in database
class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    created_at = Column(Text)
    # updated_at = Column(Text)
    modified_at = Column(Text, nullable=True)
    # author_username: Optional[str] 
    # author_uname = Column(String)  # Add author_username column
    author_id = Column(Integer, ForeignKey("users.id"))  # Foreign key relationship

    author = relationship("User", back_populates="posts")

    class Config:
        from_attributes = True


