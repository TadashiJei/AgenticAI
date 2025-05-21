"""
Input Validation Middleware
-------------------------
Middleware for validating and sanitizing API input to prevent security issues.
"""
import re
import json
import logging
from typing import Dict, Any, List, Optional, Union, Pattern
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.datastructures import FormData, UploadFile
from starlette.responses import JSONResponse

# Configure logging
logger = logging.getLogger("defensys-api.validation")

# Regular expressions for validation
URL_PATTERN = re.compile(r'^https?://[\w\-\.]+\.\w+.*$')
EMAIL_PATTERN = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')
IP_PATTERN = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$')
UUID_PATTERN = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')

# Common attack patterns to detect
ATTACK_PATTERNS = [
    re.compile(r'<script.*?>.*?</script>', re.IGNORECASE | re.DOTALL),  # Basic XSS
    re.compile(r'javascript:', re.IGNORECASE),  # JavaScript in URLs
    re.compile(r'on\w+\s*=', re.IGNORECASE),  # Event handlers
    re.compile(r'(\'|\").*?(\1).*?(=|:|<|\()', re.IGNORECASE),  # Potential SQL injection
    re.compile(r'(/\*|\*/|;|--|\\\\|@@)', re.IGNORECASE),  # SQL comment or command injection
    re.compile(r'(union|select|insert|update|delete|drop).*?(from|into|table)', re.IGNORECASE),  # SQL commands
    re.compile(r'../../', re.IGNORECASE),  # Path traversal
    re.compile(r'file://', re.IGNORECASE),  # File inclusion 
]

# Maximum input lengths
MAX_INPUT_LENGTHS = {
    "url": 2048,  # Maximum URL length
    "text": 10000,  # Maximum text field length
    "query": 1000,  # Maximum query parameter length
    "path": 512,  # Maximum path parameter length
    "json": 100000,  # Maximum JSON payload size in bytes
}

# Allowed file extensions and MIME types
ALLOWED_EXTENSIONS = {
    "image": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
    "document": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv"],
    "archive": [".zip", ".tar", ".gz", ".7z", ".rar"],
    "executable": [".exe", ".dll", ".so", ".sh", ".bat", ".py", ".js"],
}

ALLOWED_MIME_TYPES = {
    "image": ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/svg+xml", "image/webp"],
    "document": [
        "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain", "text/csv"
    ],
    "archive": ["application/zip", "application/x-tar", "application/gzip", "application/x-7z-compressed", "application/x-rar-compressed"],
    "executable": ["application/x-msdownload", "application/x-executable", "application/x-msdos-program", "text/x-python", "text/javascript"],
}

class InputValidationMiddleware(BaseHTTPMiddleware):
    """
    Middleware for validating and sanitizing input data.
    
    This middleware validates different types of input, including URL parameters, 
    query parameters, JSON payloads, and file uploads, to prevent security issues 
    like XSS, SQL injection, and file-based attacks.
    """
    
    def __init__(
        self,
        app,
        exclude_paths: List[str] = None,
        custom_patterns: Dict[str, Pattern] = None,
        max_lengths: Dict[str, int] = None,
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
            "/"
        ]
        self.custom_patterns = custom_patterns or {}
        self.max_lengths = {**MAX_INPUT_LENGTHS, **(max_lengths or {})}
    
    async def dispatch(self, request: Request, call_next):
        """Process the request through the middleware."""
        # Skip validation for excluded paths
        path = request.url.path
        for exclude_path in self.exclude_paths:
            if path.startswith(exclude_path):
                return await call_next(request)
        
        # Skip validation for preflight requests
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # Validate query parameters
        query_params = dict(request.query_params)
        for key, value in query_params.items():
            if len(value) > self.max_lengths["query"]:
                return self._error_response(
                    f"Query parameter '{key}' exceeds maximum length", 
                    "VALIDATION_ERROR", 
                    400
                )
            
            if self._contains_attack_pattern(value):
                logger.warning(f"Suspicious query parameter detected: {key}={value}")
                return self._error_response(
                    f"Invalid characters in query parameter '{key}'",
                    "VALIDATION_ERROR",
                    400
                )
        
        # Validate path parameters
        path_params = request.path_params
        for key, value in path_params.items():
            if isinstance(value, str) and len(value) > self.max_lengths["path"]:
                return self._error_response(
                    f"Path parameter '{key}' exceeds maximum length",
                    "VALIDATION_ERROR",
                    400
                )
            
            if isinstance(value, str) and self._contains_attack_pattern(value):
                logger.warning(f"Suspicious path parameter detected: {key}={value}")
                return self._error_response(
                    f"Invalid characters in path parameter '{key}'",
                    "VALIDATION_ERROR",
                    400
                )
        
        # Validate request body content
        content_type = request.headers.get("content-type", "").lower()
        
        # JSON validation
        if "application/json" in content_type:
            try:
                body = await request.body()
                if len(body) > self.max_lengths["json"]:
                    return self._error_response(
                        "Request body exceeds maximum size",
                        "VALIDATION_ERROR",
                        400
                    )
                
                # Parse JSON to validate structure
                try:
                    json_data = json.loads(body)
                    validation_result = self._validate_json_data(json_data)
                    if validation_result:
                        return self._error_response(
                            validation_result,
                            "VALIDATION_ERROR",
                            400
                        )
                except json.JSONDecodeError:
                    return self._error_response(
                        "Invalid JSON format",
                        "VALIDATION_ERROR",
                        400
                    )
            except Exception as e:
                logger.error(f"Error validating request body: {str(e)}")
        
        # Form data validation
        elif "form" in content_type:
            form_data = await request.form()
            validation_result = await self._validate_form_data(form_data)
            if validation_result:
                return self._error_response(
                    validation_result,
                    "VALIDATION_ERROR",
                    400
                )
        
        # Process request
        response = await call_next(request)
        return response
    
    def _error_response(self, message: str, error_type: str, status_code: int) -> Response:
        """Create an error response."""
        return JSONResponse(
            status_code=status_code,
            content={
                "detail": message,
                "type": error_type
            }
        )
    
    def _contains_attack_pattern(self, value: str) -> bool:
        """Check if the value contains any attack patterns."""
        if not isinstance(value, str):
            return False
        
        for pattern in ATTACK_PATTERNS:
            if pattern.search(value):
                return True
        
        return False
    
    def _validate_json_data(self, data: Any, path: str = "") -> Optional[str]:
        """
        Recursively validate JSON data for attack patterns.
        
        Args:
            data: JSON data to validate
            path: Current path in the JSON structure (for error messages)
            
        Returns:
            Error message if validation fails, None otherwise
        """
        if isinstance(data, dict):
            for key, value in data.items():
                # Validate key
                if isinstance(key, str) and self._contains_attack_pattern(key):
                    return f"Invalid characters in JSON key at {path}/{key}"
                
                # Recursive validation for values
                error = self._validate_json_data(value, f"{path}/{key}")
                if error:
                    return error
                
                # Check string length
                if isinstance(value, str) and len(value) > self.max_lengths["text"]:
                    return f"JSON value at {path}/{key} exceeds maximum length"
                
                # Check for attack patterns in strings
                if isinstance(value, str) and self._contains_attack_pattern(value):
                    return f"Invalid characters in JSON value at {path}/{key}"
        
        elif isinstance(data, list):
            for i, item in enumerate(data):
                error = self._validate_json_data(item, f"{path}[{i}]")
                if error:
                    return error
        
        elif isinstance(data, str):
            if len(data) > self.max_lengths["text"]:
                return f"String value at {path} exceeds maximum length"
            
            if self._contains_attack_pattern(data):
                return f"Invalid characters in string value at {path}"
        
        return None
    
    async def _validate_form_data(self, form_data: FormData) -> Optional[str]:
        """
        Validate form data, including file uploads.
        
        Args:
            form_data: Form data to validate
            
        Returns:
            Error message if validation fails, None otherwise
        """
        for field_name, field_value in form_data.items():
            # Validate file uploads
            if isinstance(field_value, UploadFile):
                file = field_value
                
                # Check file size (10MB limit)
                MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
                file_content = await file.read()
                await file.seek(0)  # Reset file cursor
                
                if len(file_content) > MAX_FILE_SIZE:
                    return f"File {file.filename} exceeds maximum size of 10MB"
                
                # Validate file extension
                if file.filename:
                    _, ext = os.path.splitext(file.filename.lower())
                    is_allowed = False
                    
                    for _, allowed_exts in ALLOWED_EXTENSIONS.items():
                        if ext in allowed_exts:
                            is_allowed = True
                            break
                    
                    if not is_allowed:
                        return f"File extension {ext} is not allowed"
                
                # Validate content type
                content_type = file.content_type or ""
                is_allowed = False
                
                for _, allowed_types in ALLOWED_MIME_TYPES.items():
                    if content_type in allowed_types:
                        is_allowed = True
                        break
                
                if not is_allowed:
                    return f"File content type {content_type} is not allowed"
            
            # Validate text fields
            elif isinstance(field_value, str):
                if len(field_value) > self.max_lengths["text"]:
                    return f"Form field '{field_name}' exceeds maximum length"
                
                if self._contains_attack_pattern(field_value):
                    return f"Invalid characters in form field '{field_name}'"
        
        return None
