"""
DefensysAI API
-------------
Main FastAPI application for the DefensysAI security platform.
Provides endpoints for phishing detection, malware analysis, and network security.
"""
import time
import logging
import threading
from fastapi import FastAPI, Request, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.gzip import GZipMiddleware

# Import configuration and optimization utilities
from api.config import (
    API_VERSION, DEBUG, OPTIMIZE_COLD_START, LOG_LEVEL, LOG_FORMAT,
    RESOURCE_CONFIG, PRELOAD_MODELS, MAX_REQUESTS_PER_MINUTE,
    CORS_ORIGINS, CORS_METHODS, CORS_HEADERS, AUTH_ENABLED, INPUT_VALIDATION_ENABLED
)
from api.utils.optimization import preload_models, cleanup_cache
from api.middleware.auth import AuthMiddleware
from api.middleware.validation import InputValidationMiddleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper()),
    format=LOG_FORMAT,
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("api.log")
    ]
)
logger = logging.getLogger("defensys-api")

# Create FastAPI application
app = FastAPI(
    title="DefensysAI API",
    description="AI-powered cybersecurity API for threat detection and analysis",
    version=API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    debug=DEBUG
)

# Cold-start optimization - preload models in background
if OPTIMIZE_COLD_START:
    preload_thread = threading.Thread(target=preload_models)
    preload_thread.daemon = True
    preload_thread.start()

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
    expose_headers=["X-Process-Time", "X-API-Version"],
    max_age=3600  # 1 hour cache for preflight requests
)

# Add authentication middleware if enabled
if AUTH_ENABLED:
    app.add_middleware(
        AuthMiddleware,
        exclude_paths=[
            "/docs", "/redoc", "/openapi.json",
            "/api/docs", "/api/redoc", "/api/openapi.json",
            "/api/health", "/api/auth/login", "/api/auth/register",
            "/api/auth/token", "/"
        ]
    )

# Add input validation middleware if enabled
if INPUT_VALIDATION_ENABLED:
    app.add_middleware(
        InputValidationMiddleware,
        exclude_paths=[
            "/docs", "/redoc", "/openapi.json",
            "/api/docs", "/api/redoc", "/api/openapi.json",
            "/api/health", "/"
        ]
    )

# Add GZip compression middleware for response optimization
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add rate limiting dictionary
rate_limit_data = {}
rate_limit_lock = threading.Lock()

# Import routers from endpoints
from api.endpoints.phishing import router as phishing_router
from api.endpoints.malware import router as malware_router
from api.endpoints.network import router as network_router
from api.endpoints.auth import router as auth_router

# Add routers to the application
app.include_router(phishing_router, prefix="/api/phishing", tags=["Phishing Detection"])
app.include_router(malware_router, prefix="/api/malware", tags=["Malware Analysis"])
app.include_router(network_router, prefix="/api/network", tags=["Network Security"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Request middleware for logging and timing
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and their processing time and implement rate limiting"""
    start_time = time.time()
    
    # Get request details
    method = request.method
    url = request.url.path
    client = request.client.host if request.client else "unknown"
    
    # Skip rate limiting for certain paths
    skip_rate_limit = any([
        url.startswith("/docs"),
        url.startswith("/redoc"),
        url.startswith("/openapi.json"),
        url.startswith("/api/docs"),
        url.startswith("/api/redoc"),
        url.startswith("/api/openapi.json"),
        url == "/api/health",
        url == "/"
    ])
    
    # API key-based rate limiting is handled by the AuthMiddleware
    # This is IP-based rate limiting as a backup
    if not skip_rate_limit:
        with rate_limit_lock:
            current_minute = int(time.time() / 60)
            if client not in rate_limit_data:
                rate_limit_data[client] = {}
            
            if current_minute not in rate_limit_data[client]:
                # Clean up old entries
                rate_limit_data[client] = {current_minute: 1}
            else:
                rate_limit_data[client][current_minute] += 1
                
            # Check rate limit
            if rate_limit_data[client][current_minute] > MAX_REQUESTS_PER_MINUTE:
                logger.warning(f"Rate limit exceeded for {client}: {method} {url}")
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Rate limit exceeded."},
                    headers={"Retry-After": "60"}
                )
    
    # Log request start
    logger.info(f"Request started: {method} {url} from {client}")
    
    # Process request
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        # Add API version header
        response.headers["X-API-Version"] = API_VERSION
        
        # Log successful request
        logger.info(f"Request completed: {method} {url} - Status: {response.status_code} - Time: {process_time:.4f}s")
        
        # Periodically clean cache in background (every 100 requests)
        if not skip_rate_limit and sum(rate_limit_data.get(client, {}).values()) % 100 == 0:
            cleanup_cache()
        
        return response
    except Exception as e:
        # Log failed request
        process_time = time.time() - start_time
        logger.error(f"Request failed: {method} {url} - Error: {str(e)} - Time: {process_time:.4f}s")
        
        # Return error response
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "type": str(type(e).__name__)},
        )

# Health check endpoint
@app.get("/api/health", tags=["System"])
async def health_check():
    """Health check endpoint for the API"""
    from api.utils.model_loader import get_model_info
    
    # Get model info for health check
    model_status = get_model_info()
    
    # Check if API is ready for requests
    api_ready = all(info.get("status") == "loaded" for _, info in model_status.items())
    
    return {
        "status": "healthy" if api_ready else "initializing",
        "version": app.version,
        "models": model_status,
        "resource_config": RESOURCE_CONFIG,
        "auth_enabled": AUTH_ENABLED,
        "input_validation": INPUT_VALIDATION_ENABLED
    }

# Root endpoint with API info
@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "DefensysAI API",
        "version": app.version,
        "docs_url": app.docs_url,
        "auth_enabled": AUTH_ENABLED,
        "input_validation": INPUT_VALIDATION_ENABLED,
        "authentication_url": "/api/auth/token" if AUTH_ENABLED else None
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions with proper logging"""
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "type": "HTTPException"},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions with proper logging"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": str(type(exc).__name__)},
    )

# Scheduled task to clean up expired cache entries
@app.on_event("startup")
async def startup_event():
    """Run on app startup - initialize resources"""
    logger.info("Starting DefensysAI API server")
    
    # Clean any existing cache
    cleanup_cache()
    
    # Initialize database connection if authentication is enabled
    if AUTH_ENABLED:
        from api.utils.database import get_database
        try:
            await get_database()
            logger.info("Database connection initialized")
        except Exception as e:
            logger.error(f"Error initializing database connection: {str(e)}")
    
    # Preload models synchronously if configured
    if PRELOAD_MODELS and not OPTIMIZE_COLD_START:  # Don't run twice if already running in background
        logger.info("Preloading models (sync)")
        preload_models()

@app.on_event("shutdown")
async def shutdown_event():
    """Run on app shutdown - clean up resources"""
    logger.info("Shutting down DefensysAI API server")

# Run the application
if __name__ == "__main__":
    import uvicorn
    from api.config import HOST, PORT
    
    uvicorn.run("api.main:app", host=HOST, port=PORT, reload=DEBUG)
