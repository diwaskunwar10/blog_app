# blog.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from db import get_db
from models import BlogPost, User
from schemas import BlogPostCreate, BlogPost as BlogPostSchema
from datetime import datetime
from .auth import get_current_user ,get_current_user_id
from typing import List
from sqlalchemy.sql import text
from sqlalchemy import select, outerjoin
from dotenv import load_dotenv
from pydantic import BaseModel

import os

import google.generativeai as genai
load_dotenv()

# Read environment variables for database connection
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)


@router.post("/create", status_code=201, response_model=BlogPostSchema)
def create_post(
    post: BlogPostCreate,
    current_user_username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):  
    if not current_user_username:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    # Get the user's ID from the database based on the username
    current_user = db.query(User).filter(User.username == current_user_username).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    new_post = BlogPost(
        title=post.title,
        content=post.content,
        created_at=datetime.utcnow().isoformat(),
        # updated_at=datetime.utcnow().isoformat(),
        author_id=current_user.id  # Use the user's ID as the author ID
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    new_post.author_username = current_user_username

    return new_post

@router.get("/", response_model=List[BlogPostSchema])
def get_all_posts(db: Session = Depends(get_db)):
    # Fetch all blog posts with their authors using raw SQL query
    query = """
        SELECT bp.id, bp.title, bp.content, bp.created_at,bp.author_id, u.username AS author_username
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
    """
    result = db.execute(text(query))
    rows = result.fetchall()
    print("print",rows)
    posts = []
    for row in rows:
        post_dict = {
            "id": row[0],
            "title": row[1],
            "content": row[2],
            "created_at": row[3],
            # "updated_at": row[4],
            "author_id": row[4],
            "author_username": row[5] if row[5] else "Unknown"
        }
        posts.append(post_dict)

    return posts

@router.delete("/delete/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    if not current_user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.author_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this post")

    db.delete(post)
    db.commit()

    return None


@router.put("/update/{post_id}", response_model=BlogPostSchema)
def update_post(
    post_id: int,
    post_data: BlogPostCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    if not current_user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.author_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this post")

    post.title = post_data.title
    post.content = post_data.content
    # post.updated_at = datetime.utcnow().isoformat()
    post.modified_at = datetime.utcnow().isoformat()

    db.commit()

    return post


@router.get("/{post_id}", response_model=BlogPostSchema)
def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    # Assuming author_username is a property in the BlogPost model
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "created_at": post.created_at,
        # "updated_at": post.updated_at,
        "author_id": post.author_id
    }


genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def get_response(prompt):
    response = model.generate_content(prompt)
    return response.text



class TitleRequest(BaseModel):
    title: str

@router.post("/generate")
async def generate_blog_from_title(
    title_request: TitleRequest,
    authorization: str = Header(None)
):
    try:
        # Check if authorization header is present
        if not authorization:
            raise HTTPException(status_code=401, detail="Authorization header is missing")

        # Parse authorization header
        try:
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid authorization header")

        # Call the get_current_user function to authenticate and get user info
        current_user_username = get_current_user(token)

        # Generate blog content based on the provided title
        title = title_request.title
        print("title",title)
        print("google key",GOOGLE_API_KEY)
        generated_content = get_response(title)
        return {"generatedContent": generated_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))