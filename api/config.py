"""
API Configuration
---------------
Configuration settings for the DefensysAI API, including
environment variables, feature flags, and resource limits.
"""
import os
from typing import Dict, Any, Optional

# API version
API_VERSION = "1.0.0"

# Environment settings
ENV = os.environ.get("DEFENSYS_ENV", "development")
DEBUG = os.environ.get("DEBUG", "False").lower() in ("true", "1", "yes")

# Authentication settings
AUTH_ENABLED = os.environ.get("AUTH_ENABLED", "True").lower() in ("true", "1", "yes")
JWT_SECRET = os.environ.get("DEFENSYS_JWT_SECRET", "supersecretkey123")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = int(os.environ.get("JWT_EXPIRATION_MINUTES", 30))

# Security settings
INPUT_VALIDATION_ENABLED = os.environ.get("INPUT_VALIDATION_ENABLED", "True").lower() in ("true", "1", "yes")

# Database configuration (for MongoDB)
MONGO_URI = os.environ.get("DEFENSYS_MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.environ.get("DEFENSYS_MONGO_DB", "defensys")
MONGO_TIMEOUT = int(os.environ.get("DEFENSYS_MONGO_TIMEOUT", 5000))  # ms

# Host and port configuration
HOST = os.environ.get("DEFENSYS_API_HOST", "127.0.0.1")
PORT = int(os.environ.get("DEFENSYS_API_PORT", 8000))

# CORS configuration
CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS", 
    "http://localhost:3000,http://localhost:8000,https://defensys.ai"
).split(",")
CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
CORS_HEADERS = [
    "Content-Type", "Authorization", "X-API-Key", 
    "X-Requested-With", "Accept", "Origin"
]

# Caching settings
ENABLE_CACHING = os.environ.get("ENABLE_CACHING", "True").lower() in ("true", "1", "yes")
CACHE_TTL = int(os.environ.get("CACHE_TTL", 300))  # 5 minutes
MAX_CACHE_ITEMS = int(os.environ.get("MAX_CACHE_ITEMS", 1000))

# Model settings
MODEL_PATH = os.environ.get("DEFENSYS_MODEL_PATH", None)
MODEL_CACHE_TTL = int(os.environ.get("MODEL_CACHE_TTL", 3600))  # 1 hour
PRELOAD_MODELS = os.environ.get("PRELOAD_MODELS", "True").lower() in ("true", "1", "yes")

# Performance optimization
OPTIMIZE_COLD_START = os.environ.get("OPTIMIZE_COLD_START", "True").lower() in ("true", "1", "yes")
LAZY_LOADING = os.environ.get("LAZY_LOADING", "False").lower() in ("true", "1", "yes")

# Logging configuration
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_FORMAT = os.environ.get("LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# Request limits
MAX_CONTENT_LENGTH = int(os.environ.get("MAX_CONTENT_LENGTH", 10 * 1024 * 1024))  # 10MB
MAX_REQUESTS_PER_MINUTE = int(os.environ.get("MAX_REQUESTS_PER_MINUTE", 100))
MAX_BATCH_SIZE = int(os.environ.get("MAX_BATCH_SIZE", 50))

# Memory and compute resource configuration
# These would be used in serverless environments like AWS Lambda or Google Cloud Functions
RESOURCE_CONFIG = {
    "phishing": {
        "memory": os.environ.get("PHISHING_MEMORY", "256MB"),
        "timeout": int(os.environ.get("PHISHING_TIMEOUT", 60)),  # seconds
        "max_concurrency": int(os.environ.get("PHISHING_CONCURRENCY", 100))
    },
    "malware": {
        "memory": os.environ.get("MALWARE_MEMORY", "512MB"),
        "timeout": int(os.environ.get("MALWARE_TIMEOUT", 120)),  # seconds
        "max_concurrency": int(os.environ.get("MALWARE_CONCURRENCY", 50))
    },
    "network": {
        "memory": os.environ.get("NETWORK_MEMORY", "384MB"),
        "timeout": int(os.environ.get("NETWORK_TIMEOUT", 90)),  # seconds
        "max_concurrency": int(os.environ.get("NETWORK_CONCURRENCY", 75))
    },
    "default": {
        "memory": os.environ.get("DEFAULT_MEMORY", "256MB"),
        "timeout": int(os.environ.get("DEFAULT_TIMEOUT", 60)),  # seconds
        "max_concurrency": int(os.environ.get("DEFAULT_CONCURRENCY", 100))
    }
}

# Feature flags
FEATURE_FLAGS = {
    "enable_batch_processing": True,
    "enable_detailed_analysis": True,
    "enable_streaming_responses": True,
    "enable_model_feedback": False,  # For future use
    "experimental_features": os.environ.get("EXPERIMENTAL_FEATURES", "False").lower() in ("true", "1", "yes")
}
