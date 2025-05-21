"""
API Optimization Utilities
-------------------------
Utilities for optimizing serverless function performance, including cold-start
optimization, response caching, and resource configuration.
"""
import os
import json
import time
import hashlib
import threading
import functools
from typing import Dict, Any, Callable, Optional, List, Union, Tuple
import logging

# Configure logging
logger = logging.getLogger("defensys-api.optimization")

# Cache configuration
CACHE_DIR = os.environ.get("DEFENSYS_CACHE_DIR", "api_cache")
RESPONSE_CACHE_TTL = int(os.environ.get("RESPONSE_CACHE_TTL", 300))  # 5 minutes in seconds
CACHE_ENABLED = os.environ.get("CACHE_ENABLED", "True").lower() in ("true", "1", "yes")
MAX_CACHE_SIZE = int(os.environ.get("MAX_CACHE_SIZE", 1000))  # Maximum number of cached responses

# In-memory cache
response_cache = {}
cache_lock = threading.Lock()

# Cold-start optimization
_model_initialized = False
_init_lock = threading.Lock()

# Resource configuration
RESOURCE_CONFIG = {
    "phishing": {
        "memory": "256MB",
        "timeout": 60,  # seconds
        "max_concurrency": 100
    },
    "malware": {
        "memory": "512MB",
        "timeout": 120,  # seconds
        "max_concurrency": 50
    },
    "network": {
        "memory": "384MB",
        "timeout": 90,  # seconds
        "max_concurrency": 75
    },
    "default": {
        "memory": "256MB",
        "timeout": 60,  # seconds
        "max_concurrency": 100
    }
}

# Common utility for generating cache keys
def generate_cache_key(endpoint: str, params: Dict[str, Any]) -> str:
    """
    Generate a cache key for a set of request parameters.
    
    Args:
        endpoint: API endpoint
        params: Request parameters
        
    Returns:
        Cache key string
    """
    # Convert parameters to sorted JSON string
    params_str = json.dumps(params, sort_keys=True)
    
    # Create hash for the endpoint and parameters
    key = hashlib.md5(f"{endpoint}:{params_str}".encode()).hexdigest()
    return key

# Response caching decorator
def cache_response(ttl: int = RESPONSE_CACHE_TTL, max_size: int = MAX_CACHE_SIZE):
    """
    Decorator to cache API responses.
    
    Args:
        ttl: Time-to-live for cached responses in seconds
        max_size: Maximum number of cached items
        
    Returns:
        Decorated function
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            if not CACHE_ENABLED:
                return await func(*args, **kwargs)
            
            # Extract parameters from request
            if args and hasattr(args[0], 'json') and callable(args[0].json):
                try:
                    # This is likely a FastAPI request
                    params = await args[0].json()
                except:
                    params = {}
                
                # Add query parameters if available
                if hasattr(args[0], 'query_params'):
                    for key, value in args[0].query_params.items():
                        params[key] = value
            else:
                params = kwargs
            
            # Generate cache key
            endpoint = func.__name__
            cache_key = generate_cache_key(endpoint, params)
            
            # Check if result is in cache and not expired
            with cache_lock:
                if cache_key in response_cache:
                    cached_item = response_cache[cache_key]
                    if time.time() - cached_item["timestamp"] < ttl:
                        logger.debug(f"Cache hit for {endpoint}")
                        return cached_item["response"]
            
            # If not in cache or expired, call original function
            result = await func(*args, **kwargs)
            
            # Update cache
            with cache_lock:
                # Enforce maximum cache size by removing oldest items
                if len(response_cache) >= max_size:
                    # Sort by timestamp and remove oldest
                    oldest_keys = sorted(
                        response_cache.keys(), 
                        key=lambda k: response_cache[k]["timestamp"]
                    )[:len(response_cache) - max_size + 1]
                    
                    for key in oldest_keys:
                        del response_cache[key]
                
                # Store new result
                response_cache[cache_key] = {
                    "response": result,
                    "timestamp": time.time()
                }
            
            return result
        return wrapper
    return decorator

# Function to preload models for cold-start optimization
def preload_models(model_types: List[str] = None):
    """
    Preload models to optimize cold-start performance.
    
    Args:
        model_types: List of model types to preload, or None for all
    """
    global _model_initialized
    
    if _model_initialized:
        return
    
    with _init_lock:
        if _model_initialized:
            return
        
        from api.utils.model_loader import load_model, model_cache
        
        start_time = time.time()
        
        # Load specified models or all models
        types_to_load = model_types or list(model_cache.keys())
        
        for model_type in types_to_load:
            try:
                load_model(model_type)
                logger.info(f"Preloaded {model_type} model")
            except Exception as e:
                logger.error(f"Error preloading {model_type} model: {str(e)}")
        
        _model_initialized = True
        logger.info(f"Cold-start initialization completed in {time.time() - start_time:.2f} seconds")

# Utility to clean up expired cache items
def cleanup_cache():
    """Clean up expired items from the response cache"""
    with cache_lock:
        current_time = time.time()
        expired_keys = [
            key for key, item in response_cache.items() 
            if current_time - item["timestamp"] > RESPONSE_CACHE_TTL
        ]
        
        for key in expired_keys:
            del response_cache[key]
        
        if expired_keys:
            logger.debug(f"Cleaned up {len(expired_keys)} expired cache items")

# Get resource configuration for a specific endpoint
def get_resource_config(endpoint_type: str) -> Dict[str, Any]:
    """
    Get resource configuration for a specific endpoint type.
    
    Args:
        endpoint_type: Type of endpoint
        
    Returns:
        Resource configuration dictionary
    """
    return RESOURCE_CONFIG.get(endpoint_type, RESOURCE_CONFIG["default"])
