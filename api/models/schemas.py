"""
API Data Models and Schemas
--------------------------
Pydantic models for request and response validation in the DefensysAI API.
"""
from typing import List, Dict, Optional, Any, Union
from enum import Enum
from pydantic import BaseModel, Field, HttpUrl, EmailStr, validator, AnyHttpUrl
import re
import ipaddress

# Common Response Models
class StatusEnum(str, Enum):
    """Status of API response"""
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"

class BaseResponse(BaseModel):
    """Base response model for all API endpoints"""
    status: StatusEnum = StatusEnum.SUCCESS
    message: str
    
class ErrorResponse(BaseResponse):
    """Error response model"""
    status: StatusEnum = StatusEnum.ERROR
    detail: Optional[str] = None
    error_type: Optional[str] = None
    
class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    version: str
    uptime: Optional[float] = None
    
# Phishing Detection Models
class PhishingDetectionRequest(BaseModel):
    """Request model for phishing detection endpoint"""
    url: AnyHttpUrl = Field(..., description="URL to check for phishing")
    detailed_analysis: bool = Field(False, description="Whether to return detailed analysis of the URL")
    
    @validator('url')
    def validate_url(cls, v):
        """Additional validation for URLs"""
        # Convert URL to string for validation
        url_str = str(v)
        
        # Check URL length
        if len(url_str) > 2048:
            raise ValueError("URL is too long (max 2048 characters)")
        
        # Check for common phishing patterns in URL (just basic checks)
        suspicious_patterns = [
            "login", "signin", "account", "secure", "verify", "validation", 
            "confirm", "update", "banking"
        ]
        
        url_lower = url_str.lower()
        contains_suspicious = any(pattern in url_lower for pattern in suspicious_patterns)
        
        # We don't reject the URL, but we make note of it
        if contains_suspicious:
            # Just a note, not rejecting the URL
            pass
            
        return v

class PhishingDetectionResponse(BaseResponse):
    """Response model for phishing detection endpoint"""
    url: str
    is_phishing: bool
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0.0 to 1.0)")
    threat_level: str = Field(..., description="Low, Medium, High, or Critical")
    analysis: Optional[Dict[str, Any]] = None
    detection_time: float = Field(..., description="Detection time in seconds")

# Malware Analysis Models
class MalwareAnalysisRequest(BaseModel):
    """Request model for malware analysis endpoint"""
    # No fields needed here as the file will be sent as a multipart/form-data
    scan_type: str = Field("full", description="Type of scan to perform: quick, full, or deep")
    extract_indicators: bool = Field(True, description="Whether to extract indicators of compromise")
    
    @validator('scan_type')
    def validate_scan_type(cls, v):
        """Validate scan type"""
        valid_types = ["quick", "full", "deep"]
        if v.lower() not in valid_types:
            raise ValueError(f"Scan type must be one of: {', '.join(valid_types)}")
        return v.lower()

class MalwareAnalysisResponse(BaseResponse):
    """Response model for malware analysis endpoint"""
    filename: str
    file_size: int
    file_type: str
    sha256: str
    md5: str
    is_malicious: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    threat_level: str
    threat_type: Optional[str] = None
    analysis: Dict[str, Any]
    indicators_of_compromise: Optional[List[Dict[str, Any]]] = None
    scan_time: float

# Network Security Models
class NetworkTrafficEntry(BaseModel):
    """Model for a single network traffic entry"""
    src_ip: str = Field(..., description="Source IP address")
    dst_ip: str = Field(..., description="Destination IP address")
    src_port: int = Field(..., ge=0, le=65535, description="Source port")
    dst_port: int = Field(..., ge=0, le=65535, description="Destination port")
    protocol: str = Field(..., description="TCP, UDP, ICMP, etc.")
    bytes_in: int = Field(..., ge=0, description="Bytes received")
    bytes_out: int = Field(..., ge=0, description="Bytes sent")
    packets_in: int = Field(..., ge=0, description="Packets received")
    packets_out: int = Field(..., ge=0, description="Packets sent")
    start_time: float = Field(..., description="Start timestamp of flow")
    end_time: float = Field(..., description="End timestamp of flow")
    tcp_flags: Optional[Dict[str, int]] = Field(None, description="TCP flags if protocol is TCP")
    
    @validator('src_ip', 'dst_ip')
    def validate_ip(cls, v):
        """Validate IP address"""
        try:
            ipaddress.ip_address(v)
        except ValueError:
            raise ValueError(f"Invalid IP address: {v}")
        return v
    
    @validator('protocol')
    def validate_protocol(cls, v):
        """Validate protocol"""
        valid_protocols = ["TCP", "UDP", "ICMP", "SCTP", "GRE"]
        if v.upper() not in valid_protocols:
            raise ValueError(f"Protocol must be one of: {', '.join(valid_protocols)}")
        return v.upper()

class NetworkSecurityRequest(BaseModel):
    """Request model for network security analysis endpoint"""
    traffic: List[NetworkTrafficEntry] = Field(..., min_items=1, description="List of network traffic entries")
    detection_mode: str = Field("normal", description="Detection mode: normal, sensitive, or aggressive")
    
    @validator('detection_mode')
    def validate_detection_mode(cls, v):
        """Validate detection mode"""
        valid_modes = ["normal", "sensitive", "aggressive"]
        if v.lower() not in valid_modes:
            raise ValueError(f"Detection mode must be one of: {', '.join(valid_modes)}")
        return v.lower()
    
    @validator('traffic')
    def validate_traffic(cls, v):
        """Validate traffic entries"""
        if len(v) > 1000:
            raise ValueError("Too many traffic entries (max 1000)")
        return v

class ThreatInfo(BaseModel):
    """Information about a detected threat"""
    threat_type: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    severity: str
    affected_ips: List[str]
    description: str
    recommendation: str

class NetworkSecurityResponse(BaseResponse):
    """Response model for network security analysis endpoint"""
    analyzed_entries: int
    threats_detected: int
    analysis_time: float
    threats: List[ThreatInfo] = []
    traffic_summary: Dict[str, Any]
