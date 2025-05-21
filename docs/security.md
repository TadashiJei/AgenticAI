# DefensysAI Security Documentation

This document outlines the security features implemented in the DefensysAI API, including authentication, rate limiting, CORS, and input validation.

## Authentication

The DefensysAI API uses API key-based authentication to secure endpoints. All API requests (except for explicitly excluded ones) require a valid API key.

### API Keys

API keys are long, randomly generated strings that identify and authenticate users. They should be treated as secrets and never exposed in client-side code.

#### API Key Header

Include your API key in all requests using the `X-API-Key` HTTP header:

```http
X-API-Key: your_api_key_here
```

Alternatively, you can provide the API key as a query parameter for testing and development purposes (not recommended for production):

```
https://api.defensys.ai/api/phishing/check?url=example.com&api_key=your_api_key_here
```

### User Registration and API Key Generation

To use the DefensysAI API, you need to:

1. Register a user account via the `/api/auth/register` endpoint
2. Obtain an API key via the `/api/auth/api-keys` endpoint

#### User Registration

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "full_name": "John Doe",
  "organization": "Example Corp"
}
```

#### API Key Generation

After registering, generate an API key:

```http
POST /api/auth/api-keys
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "description": "Production API key",
  "expires_in_days": 365,
  "plan": "premium",
  "scopes": ["*"]
}
```

#### Listing Your API Keys

```http
GET /api/auth/api-keys
Authorization: Bearer <jwt_token>
```

#### Revoking an API Key

```http
DELETE /api/auth/api-keys/{key_id}
Authorization: Bearer <jwt_token>
```

## Rate Limiting

The DefensysAI API implements rate limiting to prevent abuse and ensure fair usage. Rate limits vary based on the user's plan:

- **Free Plan**: 100 requests per minute
- **Basic Plan**: 500 requests per minute
- **Premium Plan**: 1000 requests per minute

If you exceed your rate limit, you'll receive a `429 Too Many Requests` response with a `Retry-After` header indicating how long to wait before making new requests.

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to allow web applications to access the API securely. The following origins are allowed by default:

- `http://localhost:3000` (local development)
- `http://localhost:8000` (local development)
- `https://defensys.ai` (production)

Custom origins can be configured via the `CORS_ORIGINS` environment variable.

## Input Validation and Sanitization

DefensysAI implements comprehensive input validation to protect against common security attacks:

- **URL validation**: Ensures URLs are properly formatted and don't contain malicious content
- **JSON payload validation**: Checks for attack patterns in JSON data
- **Form data validation**: Validates and sanitizes form inputs
- **File upload validation**: Restricts file types and sizes to prevent malicious uploads

### Sanitization Process

All input is automatically sanitized to remove potentially harmful content:

1. Detection of common attack patterns (XSS, SQL injection, etc.)
2. Input length validation to prevent buffer overflow attacks
3. File type and content validation for uploads
4. JSON structure validation for API payloads

## MongoDB Security

The API uses MongoDB for storing user data and API keys. Security measures include:

- Hashed and salted passwords using bcrypt
- Secure connection with TLS
- Proper index creation for secure and efficient queries
- Automated key expiration and cleanup

## Setup and Configuration

### Environment Variables

Configure security settings using the following environment variables:

```
# Authentication
AUTH_ENABLED=True
DEFENSYS_JWT_SECRET=your_secret_key
JWT_EXPIRATION_MINUTES=30

# MongoDB
DEFENSYS_MONGO_URI=mongodb://localhost:27017
DEFENSYS_MONGO_DB=defensys
DEFENSYS_MONGO_TIMEOUT=5000

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000,https://defensys.ai

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=100

# Input Validation
INPUT_VALIDATION_ENABLED=True
```

### Database Initialization

Run the following script to set up the MongoDB database with proper indexes and an optional admin user:

```bash
python scripts/setup_mongodb.py --create-admin --admin-username=admin
```

## Best Practices

1. **Never** embed API keys in client-side code or public repositories
2. Rotate API keys periodically (create a new key and delete the old one)
3. Use the most restrictive scopes necessary for your application
4. Set reasonable expiration dates for API keys
5. Monitor API usage through the `/api/auth/usage` endpoint
6. Use HTTPS for all API communication
7. Implement client-side input validation in addition to server-side validation

## Security Headers

The API returns the following security-related headers:

- `X-Process-Time`: Processing time in seconds
- `X-API-Version`: Current API version
- `Retry-After`: Included with rate limit responses

## Reporting Security Issues

If you discover a security vulnerability in DefensysAI, please send an email to security@defensys.ai. Do not disclose security vulnerabilities publicly until they have been handled by the security team.
