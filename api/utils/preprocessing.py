"""
Common Preprocessing Utilities
-----------------------------
Shared preprocessing functions for all API endpoints, including
input validation, normalization, and standardization.
"""
import re
import hashlib
import base64
import urllib.parse
from typing import Dict, Any, List, Union, Optional, Tuple
import numpy as np
from pydantic import AnyHttpUrl


# URL Preprocessing Functions
def normalize_url(url: str) -> str:
    """
    Normalize URL by standardizing format, removing tracking parameters, etc.
    
    Args:
        url: URL to normalize
        
    Returns:
        Normalized URL string
    """
    # Ensure URL has scheme
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    
    # Convert to lowercase
    url = url.lower()
    
    # Parse URL components
    parsed = urllib.parse.urlparse(url)
    
    # Get path without trailing slash
    path = parsed.path
    if path.endswith('/') and len(path) > 1:
        path = path[:-1]
    
    # Filter out tracking and analytics parameters
    tracking_params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 
                     'utm_content', 'fbclid', 'gclid', 'msclkid', '_ga', 'ref']
    
    query_params = urllib.parse.parse_qs(parsed.query)
    filtered_params = {k: v for k, v in query_params.items() if k.lower() not in tracking_params}
    query_string = urllib.parse.urlencode(filtered_params, doseq=True)
    
    # Rebuild URL
    normalized = urllib.parse.urlunparse((
        parsed.scheme,
        parsed.netloc,
        path,
        parsed.params,
        query_string,
        ''  # No fragment
    ))
    
    return normalized

def extract_url_features(url: str) -> Dict[str, Any]:
    """
    Extract features from a URL for analysis.
    
    Args:
        url: URL to analyze
        
    Returns:
        Dictionary of URL features
    """
    # Ensure URL is properly formatted
    if not isinstance(url, str):
        url = str(url)
    
    # Parse URL
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc
    path = parsed.path
    
    # Basic features
    features = {
        'url_length': len(url),
        'domain_length': len(domain),
        'path_length': len(path),
        'num_dots': domain.count('.'),
        'num_subdomains': len(domain.split('.')) - 1 if domain else 0,
        'has_port': bool(parsed.port),
        'has_https': parsed.scheme == 'https',
        'has_suspicious_tld': domain.split('.')[-1] if domain and '.' in domain else '' in ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq'],
        'num_path_segments': len([s for s in path.split('/') if s]),
        'num_queries': len(parsed.query.split('&')) if parsed.query else 0,
        'has_ip_in_domain': bool(re.search(r'\d+\.\d+\.\d+\.\d+', domain)),
        'has_suspicious_chars': bool(re.search(r'[^a-zA-Z0-9.-]', domain))
    }
    
    return features


# File Preprocessing Functions
def calculate_file_hashes(file_bytes: bytes) -> Dict[str, str]:
    """
    Calculate multiple hash values for a file.
    
    Args:
        file_bytes: Raw file bytes
        
    Returns:
        Dictionary of hash values (md5, sha1, sha256)
    """
    md5 = hashlib.md5(file_bytes).hexdigest()
    sha1 = hashlib.sha1(file_bytes).hexdigest()
    sha256 = hashlib.sha256(file_bytes).hexdigest()
    
    return {
        'md5': md5,
        'sha1': sha1,
        'sha256': sha256
    }

def detect_file_type(file_bytes: bytes, filename: Optional[str] = None) -> str:
    """
    Detect file type using file signatures and extensions.
    
    Args:
        file_bytes: Raw file bytes
        filename: Original filename, if available
        
    Returns:
        MIME type string
    """
    # First few bytes signatures for common file types
    signatures = {
        b'\xFF\xD8\xFF': 'image/jpeg',
        b'\x89PNG\r\n\x1A\n': 'image/png',
        b'GIF8': 'image/gif',
        b'%PDF': 'application/pdf',
        b'PK\x03\x04': 'application/zip',
        b'\x50\x4B\x03\x04\x14\x00\x06\x00': 'application/vnd.openxmlformats-officedocument.',
        b'MZ': 'application/x-dosexec',
        b'\x7FELF': 'application/x-elf',
        b'\xCF\xFA\xED\xFE': 'application/x-macho',  # Mach-O binary format
        b'\xCA\xFE\xBA\xBE': 'application/java-archive',  # Java class file
    }
    
    # Try to match file signatures
    for signature, mime_type in signatures.items():
        if file_bytes.startswith(signature):
            # Special case for Office Open XML formats
            if mime_type == 'application/vnd.openxmlformats-officedocument.':
                if filename:
                    if filename.endswith('.xlsx'):
                        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    elif filename.endswith('.docx'):
                        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    elif filename.endswith('.pptx'):
                        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                return 'application/zip'  # Default if we can't determine specific Office format
            return mime_type
    
    # Check if it's a text file by checking for printable ASCII characters
    if all(32 <= byte <= 126 or byte in (9, 10, 13) for byte in file_bytes[:min(1000, len(file_bytes))]):
        # Check for specific text formats
        if file_bytes.startswith(b'<?xml'):
            return 'application/xml'
        elif file_bytes.startswith(b'{') or file_bytes.startswith(b'['):
            # Simple heuristic for JSON
            return 'application/json'
        elif b'<html' in file_bytes[:1000].lower():
            return 'text/html'
        else:
            return 'text/plain'
    
    # Fallback to octet-stream for unknown binary data
    return 'application/octet-stream'

def extract_strings_from_binary(file_bytes: bytes, min_length: int = 4) -> List[str]:
    """
    Extract printable strings from binary data.
    
    Args:
        file_bytes: Raw file bytes
        min_length: Minimum string length to extract
        
    Returns:
        List of extracted strings
    """
    strings = []
    current_string = ""
    
    for byte in file_bytes:
        if 32 <= byte <= 126:  # Printable ASCII
            current_string += chr(byte)
        else:
            if len(current_string) >= min_length:
                strings.append(current_string)
            current_string = ""
    
    # Add the last string if it meets the length requirement
    if len(current_string) >= min_length:
        strings.append(current_string)
    
    return strings


# Network Traffic Preprocessing
def normalize_ip_address(ip: str) -> str:
    """
    Normalize IP address format.
    
    Args:
        ip: IP address string
        
    Returns:
        Normalized IP address
    """
    # Simple validation
    parts = ip.split('.')
    if len(parts) != 4:
        return ip  # Not a valid IPv4, return as is
    
    # Make sure each part is a valid integer between 0 and 255
    try:
        normalized_parts = [str(int(part)) for part in parts]
        return '.'.join(normalized_parts)
    except ValueError:
        return ip  # Not a valid IPv4, return as is

def categorize_port(port: int) -> str:
    """
    Categorize a port number into well-known, registered, or dynamic.
    
    Args:
        port: Port number
        
    Returns:
        Port category string
    """
    if 0 <= port <= 1023:
        return "well-known"
    elif 1024 <= port <= 49151:
        return "registered"
    else:
        return "dynamic"

def extract_traffic_features(traffic_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract features from network traffic data.
    
    Args:
        traffic_data: Network traffic data dictionary
        
    Returns:
        Dictionary of extracted features
    """
    features = {}
    
    # Basic traffic properties
    features['bytes_total'] = traffic_data.get('bytes_in', 0) + traffic_data.get('bytes_out', 0)
    features['packets_total'] = traffic_data.get('packets_in', 0) + traffic_data.get('packets_out', 0)
    features['avg_packet_size'] = features['bytes_total'] / features['packets_total'] if features['packets_total'] > 0 else 0
    features['duration'] = traffic_data.get('end_time', 0) - traffic_data.get('start_time', 0)
    features['bytes_per_second'] = features['bytes_total'] / features['duration'] if features['duration'] > 0 else 0
    features['packets_per_second'] = features['packets_total'] / features['duration'] if features['duration'] > 0 else 0
    
    # Protocol-specific features
    features['protocol'] = traffic_data.get('protocol', '').upper()
    features['src_port_category'] = categorize_port(traffic_data.get('src_port', 0))
    features['dst_port_category'] = categorize_port(traffic_data.get('dst_port', 0))
    
    # TCP-specific features
    if features['protocol'] == 'TCP' and 'tcp_flags' in traffic_data:
        flags = traffic_data['tcp_flags']
        features['has_syn'] = flags.get('SYN', 0) > 0
        features['has_fin'] = flags.get('FIN', 0) > 0
        features['has_rst'] = flags.get('RST', 0) > 0
        features['has_psh'] = flags.get('PSH', 0) > 0
        features['has_urg'] = flags.get('URG', 0) > 0
    
    return features


# Normalization utilities
def normalize_array(data: np.ndarray, method: str = 'minmax') -> np.ndarray:
    """
    Normalize an array of numerical values.
    
    Args:
        data: NumPy array to normalize
        method: Normalization method ('minmax', 'zscore', or 'robust')
        
    Returns:
        Normalized array
    """
    if method == 'minmax':
        min_val = np.min(data)
        max_val = np.max(data)
        if max_val - min_val > 0:
            return (data - min_val) / (max_val - min_val)
        return np.zeros_like(data)
    
    elif method == 'zscore':
        mean = np.mean(data)
        std = np.std(data)
        if std > 0:
            return (data - mean) / std
        return np.zeros_like(data)
    
    elif method == 'robust':
        median = np.median(data)
        q1 = np.percentile(data, 25)
        q3 = np.percentile(data, 75)
        iqr = q3 - q1
        if iqr > 0:
            return (data - median) / iqr
        return np.zeros_like(data)
    
    # Default: return original data
    return data

def standardize_text(text: str) -> str:
    """
    Standardize text by removing special characters, extra spaces, etc.
    
    Args:
        text: Input text string
        
    Returns:
        Standardized text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and replace with space
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
