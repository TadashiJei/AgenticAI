"""
DefensysAI API
-------------
Main FastAPI application for the DefensysAI security platform.
Provides endpoints for phishing detection, malware analysis, and network security.
"""
import time
import logging
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
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
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers from endpoints
from api.endpoints.phishing import router as phishing_router
from api.endpoints.malware import router as malware_router
from api.endpoints.network import router as network_router

# Add routers to the application
app.include_router(phishing_router, prefix="/api/phishing", tags=["Phishing Detection"])
app.include_router(malware_router, prefix="/api/malware", tags=["Malware Analysis"])
app.include_router(network_router, prefix="/api/network", tags=["Network Security"])

# Request middleware for logging and timing
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests and their processing time"""
    start_time = time.time()
    
    # Get request details
    method = request.method
    url = request.url.path
    client = request.client.host if request.client else "unknown"
    
    # Log request start
    logger.info(f"Request started: {method} {url} from {client}")
    
    # Process request
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log successful request
        logger.info(f"Request completed: {method} {url} - Status: {response.status_code} - Time: {process_time:.4f}s")
        
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
    return {"status": "healthy", "version": app.version}

# Root endpoint with API info
@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "DefensysAI API",
        "version": app.version,
        "docs_url": app.docs_url,
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

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
