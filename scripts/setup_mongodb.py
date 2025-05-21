#!/usr/bin/env python
"""
MongoDB Setup Script
-------------------
Initialize MongoDB database and collections for DefensysAI.
Creates indexes and admin user if specified.
"""
import os
import sys
import asyncio
import logging
from datetime import datetime
from argparse import ArgumentParser
from getpass import getpass

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.utils.database import get_database
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("setup-mongodb")

def get_password_hash(password):
    """Generate password hash."""
    return pwd_context.hash(password)

async def setup_database(create_admin=False, admin_username=None, admin_password=None):
    """
    Set up MongoDB database for DefensysAI.
    
    Args:
        create_admin: Whether to create an admin user
        admin_username: Admin username (if creating admin)
        admin_password: Admin password (if creating admin)
    """
    # Connect to database
    logger.info("Connecting to MongoDB...")
    db = await get_database()
    
    # Set up collections and indexes
    logger.info("Setting up collections and indexes...")
    
    # API keys collection
    api_keys_col = db.api_keys
    await api_keys_col.create_index("key", unique=True)
    await api_keys_col.create_index("user_id")
    
    # Users collection
    users_col = db.users
    await users_col.create_index("username", unique=True)
    await users_col.create_index("email", unique=True)
    
    # Rate limits collection
    rate_limits_col = db.rate_limits
    await rate_limits_col.create_index(
        [("api_key", 1), ("endpoint", 1)],
        unique=True
    )
    await rate_limits_col.create_index(
        "expires_at",
        expireAfterSeconds=0
    )
    
    # Request logs collection
    requests_col = db.requests
    await requests_col.create_index("timestamp")
    await requests_col.create_index("api_key")
    
    logger.info("Database setup complete!")
    
    # Create admin user if requested
    if create_admin:
        if not admin_username:
            admin_username = input("Admin username: ")
        
        if not admin_password:
            admin_password = getpass("Admin password: ")
            confirm_password = getpass("Confirm password: ")
            if admin_password != confirm_password:
                logger.error("Passwords don't match!")
                return
        
        # Check if admin already exists
        existing_user = await users_col.find_one({"username": admin_username})
        if existing_user:
            logger.warning(f"User {admin_username} already exists!")
            return
        
        # Create admin user
        from bson import ObjectId
        user_id = ObjectId()
        hashed_password = get_password_hash(admin_password)
        
        await users_col.insert_one({
            "_id": user_id,
            "username": admin_username,
            "email": f"{admin_username}@defensys.ai",
            "password": hashed_password,
            "full_name": "Admin User",
            "is_admin": True,
            "disabled": False,
            "created_at": datetime.utcnow()
        })
        
        # Generate API key for admin
        from api.utils.database import generate_api_key
        api_key = await generate_api_key(
            user_id=str(user_id),
            plan="premium",
            scopes=["*"]
        )
        
        logger.info(f"Admin user created: {admin_username}")
        logger.info(f"API Key: {api_key}")
        
        # Create a config file with API key for easy access
        with open(os.path.join(os.path.dirname(__file__), 'admin_api_key.txt'), 'w') as f:
            f.write(f"API_KEY={api_key}\n")
            f.write(f"USERNAME={admin_username}\n")
        
        logger.info(f"API key saved to {os.path.join(os.path.dirname(__file__), 'admin_api_key.txt')}")

if __name__ == "__main__":
    parser = ArgumentParser(description="Set up MongoDB for DefensysAI")
    parser.add_argument(
        "--create-admin",
        action="store_true",
        help="Create an admin user"
    )
    parser.add_argument(
        "--admin-username",
        help="Admin username"
    )
    parser.add_argument(
        "--admin-password",
        help="Admin password"
    )
    args = parser.parse_args()
    
    asyncio.run(setup_database(args.create_admin, args.admin_username, args.admin_password))
