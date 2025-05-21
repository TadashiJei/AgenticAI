"""
Authentication API Endpoints
-------------------------
Endpoints for user authentication, registration, and API key management.
"""
import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt

from api.utils.database import (
    get_database, generate_api_key, disable_api_key,
    validate_api_key, log_request
)
from api.middleware.auth import get_valid_api_key

# Configure logging
logger = logging.getLogger("defensys-api.auth")

# Create router
router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get("DEFENSYS_JWT_SECRET", "supersecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Schema models
class UserBase(BaseModel):
    """Base user model."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    organization: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8)

class UserInDB(UserBase):
    """User model as stored in database."""
    id: str
    disabled: bool = False
    created_at: datetime

class User(UserBase):
    """User model returned from API."""
    id: str
    created_at: datetime

class Token(BaseModel):
    """JWT token model."""
    access_token: str
    token_type: str
    expires_at: datetime

class TokenData(BaseModel):
    """JWT token data model."""
    username: Optional[str] = None

class APIKeyResponse(BaseModel):
    """API key response model."""
    key: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    plan: str
    scopes: List[str]

class APIKeyRequest(BaseModel):
    """API key creation request model."""
    description: str = Field(..., max_length=200)
    expires_in_days: Optional[int] = Field(None, ge=1, le=365)
    plan: str = Field("free", pattern="^(free|basic|premium)$")
    scopes: List[str] = ["*"]

# Helper functions
def verify_password(plain_password, hashed_password):
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Generate password hash."""
    return pwd_context.hash(password)

async def get_user(username: str):
    """Get user from database by username."""
    db = await get_database()
    user = await db.users.find_one({"username": username})
    if user:
        user["id"] = str(user.pop("_id"))
        return user
    return None

async def authenticate_user(username: str, password: str):
    """Authenticate user with username and password."""
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    """Get current active user."""
    if current_user.get("disabled", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    return current_user

# Authentication endpoints
@router.post("/register", response_model=User)
async def register(user: UserCreate):
    """
    Register a new user.
    """
    db = await get_database()
    
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = await db.users.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    from bson import ObjectId
    user_id = ObjectId()
    
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data.pop("password")
    user_data.update({
        "_id": user_id,
        "password": hashed_password,
        "disabled": False,
        "created_at": datetime.utcnow()
    })
    
    await db.users.insert_one(user_data)
    
    # Generate initial API key
    api_key = await generate_api_key(str(user_id), plan="free")
    
    # Return user data (excluding password)
    user_data.pop("password")
    user_data["id"] = str(user_id)
    user_data.pop("_id")
    
    return user_data

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Get JWT access token using username and password.
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token, expires_at = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at
    }

@router.post("/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    request: APIKeyRequest,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Create a new API key for the authenticated user.
    """
    # Set expiration date if provided
    expires_at = None
    if request.expires_in_days:
        expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days)
    
    # Generate API key
    user_id = current_user["id"]
    api_key = await generate_api_key(
        user_id=user_id,
        plan=request.plan,
        scopes=request.scopes,
        expires_at=expires_at
    )
    
    # Get API key details
    db = await get_database()
    key_doc = await db.api_keys.find_one({"key": api_key})
    
    return {
        "key": api_key,
        "created_at": key_doc["created_at"],
        "expires_at": key_doc.get("expires_at"),
        "plan": key_doc["plan"],
        "scopes": key_doc["scopes"]
    }

@router.get("/api-keys", response_model=List[Dict[str, Any]])
async def list_api_keys(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """
    List all API keys for the authenticated user.
    """
    db = await get_database()
    user_id = current_user["id"]
    
    # Find all API keys for user
    cursor = db.api_keys.find({"user_id": user_id})
    api_keys = []
    
    async for key in cursor:
        # Mask the full API key
        masked_key = key["key"][:10] + "..." + key["key"][-5:]
        
        api_keys.append({
            "id": str(key["_id"]),
            "key": masked_key,
            "created_at": key["created_at"],
            "expires_at": key.get("expires_at"),
            "last_used_at": key.get("last_used_at"),
            "plan": key["plan"],
            "disabled": key.get("disabled", False),
            "usage_count": key.get("usage_count", 0)
        })
    
    return api_keys

@router.delete("/api-keys/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_api_key(
    key_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Revoke an API key.
    """
    db = await get_database()
    user_id = current_user["id"]
    
    # Find API key
    from bson import ObjectId
    try:
        key_doc = await db.api_keys.find_one({"_id": ObjectId(key_id), "user_id": user_id})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid key ID format"
        )
    
    if not key_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    # Disable API key
    result = await disable_api_key(key_doc["key"])
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to revoke API key"
        )

@router.get("/me", response_model=User)
async def read_users_me(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """
    Get information about the current user.
    """
    return current_user

@router.get("/usage")
async def usage_statistics(
    user_info: Dict[str, Any] = Depends(get_valid_api_key)
):
    """
    Get API usage statistics for the current API key.
    """
    db = await get_database()
    api_key = user_info["api_key"]
    
    # Get API key usage statistics
    key_doc = await db.api_keys.find_one({"key": api_key})
    if not key_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    # Get request logs for the API key
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    last_week = today - timedelta(days=7)
    
    # Count requests
    total_requests = await db.requests.count_documents({"api_key": api_key})
    today_requests = await db.requests.count_documents({
        "api_key": api_key,
        "timestamp": {"$gte": today}
    })
    weekly_requests = await db.requests.count_documents({
        "api_key": api_key,
        "timestamp": {"$gte": last_week}
    })
    
    # Count by endpoint
    pipeline = [
        {"$match": {"api_key": api_key}},
        {"$group": {"_id": "$endpoint", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    top_endpoints = []
    async for doc in db.requests.aggregate(pipeline):
        top_endpoints.append({
            "endpoint": doc["_id"],
            "count": doc["count"]
        })
    
    return {
        "api_key": api_key[:10] + "..." + api_key[-5:],
        "plan": key_doc["plan"],
        "rate_limit": key_doc.get("rate_limit", 100),
        "usage_stats": {
            "total_requests": total_requests,
            "today_requests": today_requests,
            "weekly_requests": weekly_requests,
            "top_endpoints": top_endpoints
        },
        "created_at": key_doc["created_at"],
        "expires_at": key_doc.get("expires_at"),
        "last_used_at": key_doc.get("last_used_at")
    }
