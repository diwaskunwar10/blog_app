from fastapi import APIRouter, Depends, HTTPException, Request, Response, Cookie, Header
from sqlalchemy.orm import Session
from db import get_db
from models import User
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from jwt import PyJWTError
import datetime


# Load environment variables from .env
load_dotenv()

# Get the secret key from the environment variables
SECRET_KEY = os.getenv("SECRET_KEY")

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

#authentication login endpoint
@router.post("/login")
async def login(request: Request, response: Response, db: Session = Depends(get_db)):
    data = await request.json()
    #getting username and passwor form the request made on frontend by submitting
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Set expiration time for token (e.g., 30 minutes)
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    payload = {"username": user.username, "user_id": user.id, "exp": expiration_time}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    # Set the access token as an HTTP-only cookie
    response.set_cookie(key="access_token", value=token, httponly=True)

    return {"access_token": token}

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None  # User not found, return None
    
    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        return None  # Password does not match, return None
    
    return user  # User authenticated, return the user object


def create_access_token(username: str):
    try:
        payload = {"username": username}
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return token
    except Exception as e:
        # Log the error or handle it in an appropriate way
        print(f"Error creating access token: {e}")
        return None

async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        return None

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("username")
        if username is None:
            return None
        return username
    except ValueError:
        return None
    except PyJWTError:
        return None
    
async def get_current_user_id(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        return None

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: int = payload.get("user_id")
        if user_id is None:
            return None
        return user_id
    except ValueError:
        return None
    except PyJWTError:
        return None
    
@router.post("/logout")
async def logout(response: Response):
    # Remove the access token cookie from the response headers
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}
