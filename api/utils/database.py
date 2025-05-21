"""
Database Utilities
----------------
Database connection and operations for the DefensysAI API.
"""
import os
import time
import logging
from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, OperationFailure
import asyncio

# Configure logging
logger = logging.getLogger("defensys-api.database")

# MongoDB connection settings
MONGO_URI = os.environ.get("DEFENSYS_MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.environ.get("DEFENSYS_MONGO_DB", "defensys")
MONGO_TIMEOUT = int(os.environ.get("DEFENSYS_MONGO_TIMEOUT", 5000))  # ms

# MongoDB Collections
API_KEYS_COLLECTION = "api_keys"
USERS_COLLECTION = "users"
REQUESTS_COLLECTION = "requests"
RATE_LIMITS_COLLECTION = "rate_limits"

# Database client instance
_client = None
_db = None
_initialized = False
_init_lock = asyncio.Lock()

async def get_database():
    """
    Get database connection, initializing if necessary.
    
    Returns:
        AsyncIOMotorDatabase: MongoDB database instance
    """
    global _client, _db, _initialized
    
    if _initialized and _db is not None:
        return _db
    
    async with _init_lock:
        if not _initialized:
            try:
                # Connect to MongoDB
                logger.info(f"Connecting to MongoDB at {MONGO_URI}")
                _client = AsyncIOMotorClient(
                    MONGO_URI,
                    serverSelectionTimeoutMS=MONGO_TIMEOUT
                )
                
                # Verify connection
                await _client.admin.command('ping')
                
                # Get database
                _db = _client[MONGO_DB]
                
                # Create indexes for API keys collection
                await _db[API_KEYS_COLLECTION].create_index("key", unique=True)
                await _db[API_KEYS_COLLECTION].create_index("user_id")
                
                # Create indexes for users collection
                await _db[USERS_COLLECTION].create_index("username", unique=True)
                await _db[USERS_COLLECTION].create_index("email", unique=True)
                
                # Create indexes for rate limiting
                await _db[RATE_LIMITS_COLLECTION].create_index(
                    [("api_key", 1), ("endpoint", 1)],
                    unique=True
                )
                await _db[RATE_LIMITS_COLLECTION].create_index(
                    "expires_at",
                    expireAfterSeconds=0
                )
                
                # Create indexes for request logs
                await _db[REQUESTS_COLLECTION].create_index("timestamp")
                await _db[REQUESTS_COLLECTION].create_index("api_key")
                
                _initialized = True
                logger.info("MongoDB connection initialized successfully")
            
            except (ConnectionFailure, OperationFailure) as e:
                logger.error(f"Failed to connect to MongoDB: {str(e)}")
                raise
    
    return _db

async def validate_api_key(api_key: str) -> Dict[str, Any]:
    """
    Validate API key and return associated user information.
    
    Args:
        api_key: API key to validate
        
    Returns:
        Dict with user information or None if invalid
    """
    if not api_key:
        return None
    
    db = await get_database()
    key_doc = await db[API_KEYS_COLLECTION].find_one({"key": api_key})
    
    if not key_doc:
        return None
    
    # Check if key is expired
    if key_doc.get("expires_at") and key_doc["expires_at"] < datetime.utcnow():
        return None
    
    # Check if key is disabled
    if key_doc.get("disabled", False):
        return None
    
    # Get associated user
    user_id = key_doc.get("user_id")
    user = await db[USERS_COLLECTION].find_one({"_id": user_id})
    
    if not user:
        return None
    
    # Record key usage
    await db[API_KEYS_COLLECTION].update_one(
        {"key": api_key},
        {
            "$set": {"last_used_at": datetime.utcnow()},
            "$inc": {"usage_count": 1}
        }
    )
    
    return {
        "api_key": key_doc["key"],
        "user_id": str(user["_id"]),
        "username": user.get("username"),
        "email": user.get("email"),
        "plan": key_doc.get("plan", "free"),
        "rate_limit": key_doc.get("rate_limit", 100),  # requests per minute
        "scopes": key_doc.get("scopes", [])
    }

async def check_rate_limit(api_key: str, endpoint: str) -> bool:
    """
    Check if a request exceeds the rate limit for an API key.
    
    Args:
        api_key: API key to check
        endpoint: API endpoint being accessed
        
    Returns:
        True if request is allowed, False if rate limit exceeded
    """
    db = await get_database()
    
    # Get API key document to get rate limit
    key_doc = await db[API_KEYS_COLLECTION].find_one({"key": api_key})
    if not key_doc:
        return False
    
    rate_limit = key_doc.get("rate_limit", 100)  # requests per minute
    
    # Get current window
    now = datetime.utcnow()
    window_start = now.replace(second=0, microsecond=0)
    window_end = window_start + timedelta(minutes=1)
    
    # Find or create rate limit document
    rate_limit_doc = await db[RATE_LIMITS_COLLECTION].find_one(
        {
            "api_key": api_key,
            "endpoint": endpoint,
            "window_start": window_start
        }
    )
    
    if not rate_limit_doc:
        # Create new document for this minute window
        await db[RATE_LIMITS_COLLECTION].insert_one({
            "api_key": api_key,
            "endpoint": endpoint,
            "window_start": window_start,
            "expires_at": window_end + timedelta(minutes=5),  # Keep for 5 more minutes
            "counter": 1
        })
        return True
    
    # Check if rate limit exceeded
    if rate_limit_doc["counter"] >= rate_limit:
        return False
    
    # Increment counter
    await db[RATE_LIMITS_COLLECTION].update_one(
        {"_id": rate_limit_doc["_id"]},
        {"$inc": {"counter": 1}}
    )
    
    return True

async def log_request(api_key: str, endpoint: str, ip_address: str, success: bool, error: Optional[str] = None) -> None:
    """
    Log an API request for auditing purposes.
    
    Args:
        api_key: API key used for the request
        endpoint: API endpoint accessed
        ip_address: Client IP address
        success: Whether the request was successful
        error: Error message if request failed
    """
    db = await get_database()
    
    await db[REQUESTS_COLLECTION].insert_one({
        "api_key": api_key,
        "endpoint": endpoint,
        "ip_address": ip_address,
        "timestamp": datetime.utcnow(),
        "success": success,
        "error": error
    })

async def generate_api_key(user_id: str, plan: str = "free", scopes: List[str] = None, 
                    expires_at: Optional[datetime] = None) -> str:
    """
    Generate a new API key for a user.
    
    Args:
        user_id: User ID to associate with the API key
        plan: Subscription plan name
        scopes: List of authorized API scopes
        expires_at: Expiration date for the key
        
    Returns:
        Generated API key
    """
    db = await get_database()
    
    import secrets
    
    # Generate secure random API key
    api_key = secrets.token_urlsafe(32)
    
    # Store API key in database
    await db[API_KEYS_COLLECTION].insert_one({
        "key": api_key,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "last_used_at": None,
        "expires_at": expires_at,
        "disabled": False,
        "plan": plan,
        "scopes": scopes or ["*"],  # Default to all scopes
        "usage_count": 0
    })
    
    return api_key

async def disable_api_key(api_key: str) -> bool:
    """
    Disable an API key.
    
    Args:
        api_key: API key to disable
        
    Returns:
        True if successful, False otherwise
    """
    db = await get_database()
    
    result = await db[API_KEYS_COLLECTION].update_one(
        {"key": api_key},
        {"$set": {"disabled": True}}
    )
    
    return result.modified_count > 0
