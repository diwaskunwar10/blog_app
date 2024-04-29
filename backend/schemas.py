from pydantic import BaseModel
from typing import Optional


# Schema for base user data
class UserBase(BaseModel):
    username: str
    email: str

# Schema for creating a new user
class UserCreate(UserBase):
    password: str

# Schema for user data with ID
class User(UserBase):
    id: int

    class Config:
        orm_mode = True

# class BlogPostBase(BaseModel):
#     title: str
#     content: str

# class BlogPostCreate(BlogPostBase):
#     pass

# class BlogPost(BlogPostBase):
#     id: int
#     created_at: str
#     updated_at: str
#     author_id: int
#     author_uname:str


#     class Config:
#         orm_mode = True



class BlogPostBase(BaseModel):
    title: str
    content: str

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    id: int
    created_at: str
    # updated_at: str
    author_id: int
    modified_at: Optional[str] = None 
    author_username:Optional[str]=None

    class Config:
        orm_mode = True