# Dytor Manager - API Documentation

## Overview

This document describes the REST API endpoints required by Dytor Manager. All endpoints use JSON for request and response bodies.

## Base URL

```
http://localhost:5000/api
```

All requests should include appropriate headers:

```
Content-Type: application/json
Authorization: Bearer <token>
```

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Authentication Endpoints

### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@dytor.app",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user_001",
      "name": "Admin User",
      "email": "admin@dytor.app",
      "role": "administrator"
    }
  }
}
```

### Logout

```
POST /auth/logout
```

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token

```
POST /auth/refresh
```

**Request Body:**
```json
{
  "token": "old_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_token_here"
  }
}
```

### Get Current User Profile

```
GET /auth/profile
```

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "name": "Admin User",
    "email": "admin@dytor.app",
    "role": "administrator",
    "permissions": ["read:all", "write:all", "delete:all"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## User Management Endpoints

### List All Users

```
GET /users
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)
- `sort` (string): Sort field (default: createdAt)
- `order` (string): Sort order - 'asc' or 'desc'

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "administrator",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get User by ID

```
GET /users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "administrator",
    "status": "active",
    "permissions": ["read:all", "write:all"],
    "teams": ["team_001"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

### Create User

```
POST /users
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "team_lead",
  "status": "active"
}
```

**Response:** Created user object with ID

### Update User

```
PUT /users/:id
```

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "role": "administrator",
  "status": "active"
}
```

**Response:** Updated user object

### Delete User

```
DELETE /users/:id
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Search Users

```
GET /users/search
```

**Query Parameters:**
- `q` (string): Search query (searches name, email, role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "administrator"
    }
  ]
}
```

## Team Management Endpoints

### List All Teams

```
GET /teams
```

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_001",
      "name": "Engineering",
      "description": "Engineering team",
      "memberCount": 8,
      "leadId": "user_001",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

### Get Team by ID

```
GET /teams/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_001",
    "name": "Engineering",
    "description": "Engineering team",
    "lead": { /* user object */ },
    "members": [ /* user array */ ],
    "budget": 50000,
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Create Team

```
POST /teams
```

**Request Body:**
```json
{
  "name": "Marketing",
  "description": "Marketing team",
  "leadId": "user_002",
  "budget": 30000
}
```

**Response:** Created team object with ID

### Update Team

```
PUT /teams/:id
```

**Request Body:**
```json
{
  "name": "Marketing Updated",
  "budget": 40000,
  "status": "active"
}
```

**Response:** Updated team object

### Delete Team

```
DELETE /teams/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

### Get Team Members

```
GET /teams/:id/members
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "lead"
    }
  ]
}
```

## Infrastructure Endpoints

### Get All Servers

```
GET /infrastructure/servers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "server_001",
      "name": "API Server 1",
      "status": "healthy",
      "region": "US-East-1",
      "ipAddress": "192.168.1.1",
      "cpu": 65,
      "memory": 42,
      "storage": 78,
      "uptime": "99.9%",
      "lastUpdate": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### Get Server Status

```
GET /infrastructure/servers/:id
```

**Response:** Single server object with detailed metrics

### Get System Metrics

```
GET /infrastructure/metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cpuUsage": 64,
    "memoryUsage": 45,
    "storageUsage": 74,
    "networkIn": "2.5 Gbps",
    "networkOut": "1.8 Gbps",
    "requestsPerSecond": 1200
  }
}
```

### Get System Health

```
GET /infrastructure/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "lastCheck": "2024-01-15T12:00:00Z",
    "services": {
      "api": { "status": "healthy", "uptime": "99.9%" },
      "database": { "status": "healthy", "uptime": "99.95%" },
      "cache": { "status": "healthy", "uptime": "99.8%" },
      "email": { "status": "degraded", "uptime": "98.5%" }
    }
  }
}
```

## Settings Endpoints

### Get All Settings

```
GET /settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "appName": "Dytor Manager",
    "appVersion": "1.0.0",
    "emailConfiguration": { /* ... */ },
    "securitySettings": { /* ... */ },
    "backupSettings": { /* ... */ }
  }
}
```

### Update Settings

```
PUT /settings
```

**Request Body:**
```json
{
  "appName": "Dytor Manager Updated",
  "enableTwoFA": true,
  "maxLoginAttempts": 5
}
```

**Response:** Updated settings object

### Get Email Configuration

```
GET /settings/email
```

**Response:**
```json
{
  "success": true,
  "data": {
    "from": "noreply@dytor.app",
    "smtp": "smtp.dytor.app",
    "port": 587,
    "secure": true,
    "auth": { /* credentials */ }
  }
}
```

### Update Email Configuration

```
PUT /settings/email
```

**Request Body:**
```json
{
  "from": "noreply@dytor.app",
  "smtp": "smtp.dytor.app",
  "port": 587,
  "username": "user@example.com",
  "password": "password"
}
```

**Response:** Updated email configuration

### Test Email Connection

```
POST /settings/email/test
```

**Request Body:**
```json
{
  "testEmail": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Dashboard Endpoints

### Get Dashboard Overview

```
GET /dashboard/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1234,
    "activeTeams": 42,
    "systemUptime": "99.9%",
    "monthlyRevenue": 12450
  }
}
```

### Get Dashboard Statistics

```
GET /dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userGrowth": {
      "value": 1234,
      "change": 12,
      "trend": "up"
    },
    "teamActivity": {
      "value": 42,
      "change": 5,
      "trend": "up"
    }
  }
}
```

### Get Recent Activity

```
GET /dashboard/activity
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity_001",
      "action": "User created",
      "user": "admin@dytor.app",
      "timestamp": "2024-01-15T12:00:00Z"
    }
  ]
}
```

## Error Handling

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | User lacks permission for this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Response Example

```json
{
  "success": false,
  "error": "User email already exists",
  "code": "CONFLICT",
  "status": 409
}
```

## Rate Limiting

All endpoints are rate-limited to:
- **Anonymous**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Admin**: Unlimited

Rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

## Pagination

List endpoints support pagination:

```
GET /users?page=1&limit=20
```

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Filtering & Sorting

Most list endpoints support filtering and sorting:

```
GET /users?status=active&sort=name&order=asc
```

## Implementation Notes

- All timestamps are in ISO 8601 format (UTC)
- IDs are unique strings (format: `resource_nnnn`)
- Passwords are never returned in responses
- Sensitive data is masked in logs
