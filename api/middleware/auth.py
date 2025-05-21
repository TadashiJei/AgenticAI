"""
Authentication Middleware
-----------------------
Middleware for API key authentication and validation.
"""
import logging
from typing import Dict, Any, Optional, Callable, Awaitable
from fastapi import Request, Response, HTTPException, Depends, status, Security
from fastapi.security import APIKeyHeader
from fastapi.security.api_key import APIKeyBase, APIKey
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware

from api.utils.database import validate_api_key, check_rate_limit, log_request

# Configure logging
logger = logging.getLogger("defensys-api.auth")

# API Key header
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

class APIKeyAuth(APIKeyBase):
    """API Key authentication scheme."""
    
    def __init__(self, name: str, scheme_name: Optional[str] = None):
        self.scheme_name = scheme_name or self.__class__.__name__
        self.name = name
        self.model = APIKey(**{"in": "header", "name": self.name})
    
    async def __call__(self, request: Request) -> Optional[str]:
        api_key = request.headers.get(self.name)
        if not api_key:
            # Also check for query parameter
            api_key = request.query_params.get("api_key")
        
        return api_key

# Create API key security scheme
api_key_scheme = APIKeyAuth(name="X-API-Key", scheme_name="APIKeyHeader")

async def get_valid_api_key(
    api_key: str = Security(api_key_scheme),
    request: Request = None
) -> Dict[str, Any]:
    """
    Validate API key and return user info or raise HTTPException.
    
    Args:
        api_key: API key from header
        request: FastAPI request object
        
    Returns:
        User info dict if valid
        
    Raises:
        HTTPException: If API key is invalid
    """
    if api_key is None:
        logger.warning(f"API request without key: {request.url.path}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key"
        )
    
    # Validate API key
    user_info = await validate_api_key(api_key)
    if user_info is None:
        logger.warning(f"Invalid API key: {api_key[:10]}... for {request.url.path}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    # Check rate limit
    if not await check_rate_limit(api_key, request.url.path):
        logger.warning(f"Rate limit exceeded for API key: {api_key[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
            headers={"Retry-After": "60"}
        )
    
    # Log successful API key validation
    client_ip = request.client.host if request.client else "unknown"
    await log_request(
        api_key=api_key,
        endpoint=request.url.path,
        ip_address=client_ip,
        success=True
    )
    
    return user_info

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware for API key authentication.
    
    This middleware validates API keys for all routes except those in the exception list.
    It also logs all requests for auditing purposes.
    """
    
    def __init__(
        self,
        app,
        exclude_paths: list = None
    ):
        super().__init__(app)
        self.exclude_paths = exclude_paths or [
            "/docs",
            "/redoc",
            "/openapi.json",
            "/api/docs",
            "/api/redoc",
            "/api/openapi.json",
            "/api/health",
            "/api/auth/login",
            "/api/auth/register",
            "/"
        ]
    
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Skip authentication for excluded paths
        path = request.url.path
        for exclude_path in self.exclude_paths:
            if path.startswith(exclude_path):
                response = await call_next(request)
                return response
        
        # Get API key from header or query parameter
        api_key = request.headers.get("X-API-Key")
        if not api_key:
            api_key = request.query_params.get("api_key")
        
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Skip validation for OPTIONS requests (preflight)
        if request.method == "OPTIONS":
            response = await call_next(request)
            return response
        
        if not api_key:
            # Log unauthorized request
            await log_request(
                api_key="none",
                endpoint=path,
                ip_address=client_ip,
                success=False,
                error="Missing API key"
            )
            
            return Response(
                content='{"detail":"Missing API key"}',
                status_code=status.HTTP_401_UNAUTHORIZED,
                media_type="application/json"
            )
        
        # Validate API key
        user_info = await validate_api_key(api_key)
        if not user_info:
            # Log invalid API key
            await log_request(
                api_key=api_key,
                endpoint=path,
                ip_address=client_ip,
                success=False,
                error="Invalid API key"
            )
            
            return Response(
                content='{"detail":"Invalid API key"}',
                status_code=status.HTTP_401_UNAUTHORIZED,
                media_type="application/json"
            )
        
        # Check rate limit
        if not await check_rate_limit(api_key, path):
            # Log rate limit exceeded
            await log_request(
                api_key=api_key,
                endpoint=path,
                ip_address=client_ip,
                success=False,
                error="Rate limit exceeded"
            )
            
            return Response(
                content='{"detail":"Rate limit exceeded"}',
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={"Retry-After": "60"},
                media_type="application/json"
            )
        
        # Store user info in request state
        request.state.user = user_info
        request.state.api_key = api_key
        
        # Process request
        try:
            response = await call_next(request)
            
            # Log successful request
            await log_request(
                api_key=api_key,
                endpoint=path,
                ip_address=client_ip,
                success=True
            )
            
            return response
        except Exception as e:
            # Log failed request
            await log_request(
                api_key=api_key,
                endpoint=path,
                ip_address=client_ip,
                success=False,
                error=str(e)
            )
            
            raise
