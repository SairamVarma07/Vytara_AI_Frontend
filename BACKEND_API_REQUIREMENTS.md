# Backend API Requirements - Vytara Wellbeing App

## Table of Contents
1. [Overview](#overview)
2. [General Requirements](#general-requirements)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Security Requirements](#security-requirements)
8. [Performance Requirements](#performance-requirements)

---

## Overview

This document outlines the backend API requirements for the Vytara Wellbeing App. The frontend is built with React and expects a RESTful API with JWT-based authentication.

**Base URL**: `http://localhost:3000/api` (development)

**API Version**: v1

---

## General Requirements

### Response Format

All API responses should follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": { ... }
  }
}
```

### Headers

**Required Request Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (for protected routes)

**Required Response Headers:**
- `Content-Type: application/json`
- CORS headers (allow frontend origin)

### HTTP Status Codes

- `200` - OK (successful GET, PUT, PATCH)
- `201` - Created (successful POST)
- `204` - No Content (successful DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (validation errors)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
- `503` - Service Unavailable

### Pagination

For list endpoints, support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Authentication & Authorization

### JWT Token Structure

**Access Token:**
- Expiry: 15 minutes
- Payload: `{ userId, email, iat, exp }`

**Refresh Token:**
- Expiry: 7 days
- Payload: `{ userId, tokenId, iat, exp }`
- Store in database with ability to revoke

### Token Storage

Frontend stores tokens in:
- `sessionStorage` (default)
- `localStorage` (when "Remember Me" is checked)

---

## API Endpoints

### 1. Authentication

#### POST `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "agreeToTerms": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "avatar": null,
      "createdAt": "2026-01-15T10:00:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

**Validation:**
- Email: valid format, unique, max 255 chars
- Password: min 8 chars, must contain uppercase, lowercase, number
- Full Name: min 2 chars, max 100 chars
- agreeToTerms: must be true

---

#### POST `/api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "rememberMe": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "avatar": "https://...",
      "preferences": {
        "dailyCalorieGoal": 2000,
        "macroGoals": { "protein": 150, "carbs": 200, "fats": 65 },
        "waterGoal": 8,
        "theme": "dark"
      }
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

**Errors:**
- 401: Invalid credentials
- 400: Missing required fields

---

#### POST `/api/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

**Errors:**
- 401: Invalid or expired refresh token

---

#### POST `/api/auth/logout`

Logout and invalidate refresh token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST `/api/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### POST `/api/auth/reset-password`

Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 2. User Profile

#### GET `/api/user/profile`

Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatar": "https://...",
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-01-15T10:00:00Z",
    "preferences": {
      "dailyCalorieGoal": 2000,
      "macroGoals": { "protein": 150, "carbs": 200, "fats": 65 },
      "waterGoal": 8,
      "theme": "dark"
    }
  }
}
```

---

#### PUT `/api/user/profile`

Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "avatar": "https://...",
  "preferences": {
    "dailyCalorieGoal": 2200,
    "macroGoals": { "protein": 160, "carbs": 220, "fats": 70 },
    "waterGoal": 10,
    "theme": "light"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Profile updated successfully"
}
```

---

### 3. Chat / AI Assistant

#### GET `/api/chat`

Get all chats for current user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional)
- `limit` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "chat_123",
      "userId": "user_123",
      "title": "Daily Check-in",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T11:00:00Z",
      "messageCount": 5
    }
  ]
}
```

---

#### GET `/api/chat/:chatId`

Get a specific chat with all messages.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "chat_123",
    "userId": "user_123",
    "title": "Daily Check-in",
    "messages": [
      {
        "id": "msg_123",
        "chatId": "chat_123",
        "sender": "assistant",
        "text": "Hi! How are you feeling today?",
        "attachment": null,
        "timestamp": "2026-01-15T10:00:00Z"
      },
      {
        "id": "msg_124",
        "chatId": "chat_123",
        "sender": "user",
        "text": "I'm feeling great!",
        "attachment": null,
        "timestamp": "2026-01-15T10:01:00Z"
      }
    ],
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-01-15T11:00:00Z"
  }
}
```

---

#### POST `/api/chat`

Create a new chat.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "My New Chat"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "chat_456",
    "userId": "user_123",
    "title": "My New Chat",
    "messages": [],
    "createdAt": "2026-01-15T12:00:00Z"
  }
}
```

---

#### POST `/api/chat/:chatId/messages`

Send a message in a chat.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "I need help with meal planning",
  "attachment": {
    "name": "meal.jpg",
    "type": "image/jpeg",
    "size": 102400,
    "url": "https://storage.../meal.jpg"
  }
}
```

**Note:** File upload should be handled separately (see File Upload section).

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg_125",
      "chatId": "chat_123",
      "sender": "user",
      "text": "I need help with meal planning",
      "attachment": { ... },
      "timestamp": "2026-01-15T10:05:00Z"
    },
    "assistantMessage": {
      "id": "msg_126",
      "chatId": "chat_123",
      "sender": "assistant",
      "text": "I'd be happy to help with meal planning! What are your dietary preferences?",
      "attachment": null,
      "timestamp": "2026-01-15T10:05:02Z"
    }
  }
}
```

**AI Response Requirements:**
- Response should be generated using AI (OpenAI, Anthropic, etc.)
- Context: wellness and mental health focus
- Should be empathetic and supportive
- Response time: < 5 seconds

---

#### DELETE `/api/chat/:chatId`

Delete a chat.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

### 4. Nutrition Tracking

#### GET `/api/nutrition/meals`

Get meals for a specific date.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `date` - Date in YYYY-MM-DD format (required)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "meal_123",
      "userId": "user_123",
      "type": "breakfast",
      "name": "Oatmeal with berries",
      "calories": 350,
      "macros": {
        "protein": 12,
        "carbs": 58,
        "fats": 8
      },
      "time": "08:30",
      "date": "2026-01-15",
      "createdAt": "2026-01-15T08:30:00Z"
    }
  ]
}
```

---

#### POST `/api/nutrition/meals`

Add a new meal.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "lunch",
  "name": "Grilled chicken salad",
  "calories": 450,
  "macros": {
    "protein": 35,
    "carbs": 25,
    "fats": 18
  },
  "time": "12:30",
  "date": "2026-01-15"
}
```

**Validation:**
- type: must be one of: breakfast, lunch, dinner, snack
- name: required, max 200 chars
- calories: required, positive number
- macros: all required, positive numbers
- time: HH:mm format
- date: YYYY-MM-DD format

**Response (201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Meal logged successfully"
}
```

---

#### PUT `/api/nutrition/meals/:mealId`

Update a meal.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (same as POST, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Meal updated successfully"
}
```

---

#### DELETE `/api/nutrition/meals/:mealId`

Delete a meal.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

#### GET `/api/nutrition/goal`

Get user's daily nutrition goals.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dailyCalorieGoal": 2000,
    "macroGoals": {
      "protein": 150,
      "carbs": 200,
      "fats": 65
    }
  }
}
```

---

#### PUT `/api/nutrition/goal`

Update nutrition goals.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "dailyCalorieGoal": 2200,
  "macroGoals": {
    "protein": 160,
    "carbs": 220,
    "fats": 70
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Goals updated successfully"
}
```

---

#### GET `/api/nutrition/water`

Get water intake for a specific date.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `date` - Date in YYYY-MM-DD format (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "water_123",
    "userId": "user_123",
    "glasses": 6,
    "date": "2026-01-15",
    "updatedAt": "2026-01-15T15:00:00Z"
  }
}
```

---

#### PUT `/api/nutrition/water`

Update water intake.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "glasses": 7,
  "date": "2026-01-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Water intake updated"
}
```

---

#### GET `/api/nutrition/stats`

Get nutrition statistics (weekly/monthly).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` - "week" or "month" (default: "week")
- `startDate` - Start date (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "startDate": "2026-01-08",
    "endDate": "2026-01-15",
    "stats": [
      {
        "date": "2026-01-15",
        "totalCalories": 1850,
        "totalMacros": {
          "protein": 145,
          "carbs": 190,
          "fats": 62
        },
        "waterGlasses": 7,
        "mealsLogged": 4
      }
    ],
    "averages": {
      "calories": 1920,
      "protein": 148,
      "carbs": 195,
      "fats": 64,
      "water": 7.2
    }
  }
}
```

---

### 5. Task Management

#### GET `/api/tasks/lists`

Get all task lists for current user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "list_123",
      "userId": "user_123",
      "name": "Work Tasks",
      "taskCount": 5,
      "completedCount": 2,
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T11:00:00Z"
    }
  ]
}
```

---

#### POST `/api/tasks/lists`

Create a new task list.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Personal Tasks"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "list_456",
    "userId": "user_123",
    "name": "Personal Tasks",
    "createdAt": "2026-01-15T12:00:00Z"
  }
}
```

---

#### PUT `/api/tasks/lists/:listId`

Update task list name.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated List Name"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### DELETE `/api/tasks/lists/:listId`

Delete a task list and all its tasks.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

#### GET `/api/tasks/lists/:listId/tasks`

Get all tasks in a list.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_123",
      "listId": "list_123",
      "text": "Complete project proposal",
      "priority": "High",
      "deadline": "2026-01-20",
      "completed": false,
      "xpGranted": false,
      "createdAt": "2026-01-15T10:00:00Z",
      "completedAt": null
    }
  ]
}
```

---

#### POST `/api/tasks/lists/:listId/tasks`

Add a task to a list.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Review code changes",
  "priority": "Medium",
  "deadline": "2026-01-18"
}
```

**Validation:**
- text: required, max 500 chars
- priority: must be "Low", "Medium", or "High"
- deadline: optional, YYYY-MM-DD format

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### PUT `/api/tasks/lists/:listId/tasks/:taskId`

Update a task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "text": "Updated task text",
  "priority": "High",
  "deadline": "2026-01-19",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    ...task,
    "xpEarned": 30
  }
}
```

**Note:** When a task is marked as completed for the first time, award XP based on priority:
- High: 30 XP
- Medium: 20 XP
- Low: 10 XP

---

#### DELETE `/api/tasks/lists/:listId/tasks/:taskId`

Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

#### GET `/api/tasks/stats`

Get user's task statistics and gamification data.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "xp": 250,
    "level": 3,
    "tasksCompleted": 25,
    "streak": 5,
    "lastActivity": "2026-01-15T11:00:00Z",
    "nextLevelXp": 300
  }
}
```

---

#### GET `/api/tasks/leaderboard`

Get leaderboard (top users by XP).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional, default: 10, max: 50)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_456",
      "fullName": "Jane Smith",
      "avatar": "https://...",
      "xp": 500,
      "level": 5,
      "rank": 1
    },
    {
      "userId": "user_123",
      "fullName": "John Doe",
      "avatar": "https://...",
      "xp": 250,
      "level": 3,
      "rank": 2
    }
  ],
  "currentUser": {
    "userId": "user_123",
    "rank": 2,
    "xp": 250,
    "level": 3
  }
}
```

---

### 6. File Upload

#### POST `/api/upload`

Upload a file (for chat attachments, profile avatars, etc.).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:** Form data with file

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.../file-123.jpg",
    "name": "meal.jpg",
    "type": "image/jpeg",
    "size": 102400
  }
}
```

**Validation:**
- Max file size: 10MB
- Allowed types: image/png, image/jpeg, image/jpg, image/gif, application/pdf

---

## Data Models

### User
```typescript
{
  id: string (UUID)
  email: string (unique, indexed)
  passwordHash: string
  fullName: string
  avatar: string | null
  createdAt: Date
  updatedAt: Date
  preferences: {
    dailyCalorieGoal: number
    macroGoals: {
      protein: number
      carbs: number
      fats: number
    }
    waterGoal: number
    theme: string
  }
}
```

### Chat
```typescript
{
  id: string (UUID)
  userId: string (foreign key, indexed)
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
```

### Message
```typescript
{
  id: string (UUID)
  chatId: string (foreign key, indexed)
  sender: 'user' | 'assistant'
  text: string
  attachment: {
    name: string
    type: string
    size: number
    url: string
  } | null
  timestamp: Date
}
```

### Meal
```typescript
{
  id: string (UUID)
  userId: string (foreign key, indexed)
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fats: number
  }
  time: string (HH:mm)
  date: Date (indexed)
  createdAt: Date
}
```

### WaterIntake
```typescript
{
  id: string (UUID)
  userId: string (foreign key)
  glasses: number
  date: Date (indexed, unique per user per day)
  updatedAt: Date
}
```

### TaskList
```typescript
{
  id: string (UUID)
  userId: string (foreign key, indexed)
  name: string
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  id: string (UUID)
  listId: string (foreign key, indexed)
  text: string
  priority: 'Low' | 'Medium' | 'High'
  deadline: Date | null
  completed: boolean (indexed)
  xpGranted: boolean
  createdAt: Date
  completedAt: Date | null
}
```

### UserStats
```typescript
{
  userId: string (foreign key, unique)
  xp: number
  level: number
  tasksCompleted: number
  streak: number
  lastActivity: Date
}
```

### RefreshToken
```typescript
{
  id: string (UUID)
  userId: string (foreign key, indexed)
  token: string (hashed)
  expiresAt: Date
  createdAt: Date
}
```

---

## Error Handling

### Error Codes

Use consistent error codes for client-side error handling:

- `VALIDATION_ERROR` - Input validation failed
- `AUTH_REQUIRED` - Authentication required
- `INVALID_TOKEN` - Invalid or expired token
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_EXISTS` - Email already registered
- `NOT_FOUND` - Resource not found
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error

### Validation Error Format

For validation errors (422), include field-specific errors:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 422,
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

## Security Requirements

### Authentication
- Use bcrypt for password hashing (cost factor: 12)
- Implement JWT with RS256 algorithm
- Store refresh tokens in database with ability to revoke
- Implement token rotation on refresh

### Authorization
- Validate user ownership for all resources
- Implement rate limiting (100 req/15min per IP)
- Sanitize all user inputs
- Validate file uploads (size, type, content)

### Data Protection
- Use HTTPS in production
- Implement CORS properly (whitelist frontend origin)
- Never expose sensitive data in responses
- Implement SQL injection protection
- Implement XSS protection

### Session Management
- Invalidate tokens on logout
- Implement password reset with time-limited tokens
- Allow users to view active sessions
- Implement concurrent session limits (optional)

---

## Performance Requirements

### Response Times
- Authentication: < 500ms
- CRUD operations: < 300ms
- Chat AI response: < 5s
- File upload: Depends on size, but show progress

### Optimization
- Implement database indexing on foreign keys and frequently queried fields
- Use connection pooling
- Implement caching for frequently accessed data (user profiles, goals)
- Paginate large result sets
- Compress responses

### Scalability
- Design for horizontal scaling
- Use stateless authentication (JWT)
- Consider implementing message queues for AI chat processing
- Consider CDN for file uploads

---

## Additional Notes

### CORS Configuration
Allow these headers:
- `Authorization`
- `Content-Type`
- `X-Requested-With`

Allow these methods:
- `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

### WebSockets (Optional Enhancement)
Consider implementing WebSockets for:
- Real-time chat message delivery
- Typing indicators
- Live leaderboard updates

### AI Integration
- Use OpenAI API or similar for chat responses
- Context: wellness, mental health, nutrition
- Temperature: 0.7
- Max tokens: 500
- System prompt should emphasize supportive, non-medical advice

### Database Recommendations
- PostgreSQL (primary choice for relational data)
- MongoDB (alternative for flexible schema)
- Redis (for caching and sessions)

### Testing
- Implement unit tests for all endpoints
- Implement integration tests
- Test authentication flows thoroughly
- Test error cases and edge cases

---

## Questions & Support

For questions or clarifications about these requirements, please contact the frontend team.

**Frontend Base URL**: `http://localhost:5173` (development)
**Frontend Framework**: React 19 with Vite
**State Management**: Context API
**Styling**: CSS Modules

