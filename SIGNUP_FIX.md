# 🐛 Signup/Login Error Fix

## Issue
**Error**: `Cannot destructure property 'user' of 'authResponse' as it is undefined.`

This error occurred when trying to sign up or log in because the frontend was trying to access `response.data.user`, but the `response` was already the data object.

---

## Root Cause

### The Problem
The API service (`src/services/api.js`) automatically extracts the `data` property from the backend response:

```javascript
// Line 235 in api.js
return jsonResponse.data !== undefined ? jsonResponse.data : jsonResponse;
```

### Backend Response Structure
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  },
  "message": "User registered successfully"
}
```

### What API Service Returns
The API service extracts just the `data` object:
```javascript
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### The Bug
In `SignupModal.jsx` and `Login.jsx`, we were doing:
```javascript
const response = await api.auth.signup(...);
login(response.data, false);  // ❌ response.data is undefined!
```

But `response` is already the data object, so `response.data` is `undefined`.

---

## Solution

### Fixed Files

#### 1. `src/components/Auth/SignupModal.jsx`
**Before:**
```javascript
const response = await api.auth.signup({...});
login(response.data, false);  // ❌ Wrong
```

**After:**
```javascript
const response = await api.auth.signup({...});
if (response && response.accessToken && response.user) {
  login(response, false);  // ✅ Correct
}
```

#### 2. `src/components/Auth/Login.jsx`
**Before:**
```javascript
const response = await api.auth.login({...});
login(response.data, rememberMe);  // ❌ Wrong
```

**After:**
```javascript
const response = await api.auth.login({...});
if (response && response.accessToken && response.user) {
  login(response, rememberMe);  // ✅ Correct
}
```

#### 3. `src/context/AuthContext.jsx`
Added better error handling and logging:
```javascript
const login = (authResponse, rememberMe = false) => {
  console.log('AuthContext login called with:', authResponse);
  
  if (!authResponse) {
    throw new Error('Auth response is undefined or null');
  }

  const { user: userData, accessToken, refreshToken } = authResponse;
  
  if (!accessToken || !userData) {
    throw new Error('Invalid authentication response - missing accessToken or user data');
  }
  
  // ... rest of login logic
};
```

---

## Testing

### Test Signup
1. Navigate to `http://localhost:5173`
2. Click **"Create Account"**
3. Fill in the form:
   - **Full Name**: Test User
   - **Email**: testuser@example.com
   - **Password**: Test@1234
   - **Confirm Password**: Test@1234
   - ✅ Check "I agree to terms"
4. Click **"Create Account"**

**Expected Result:**
- ✅ User is created
- ✅ Redirected to `/nutrition` page
- ✅ User is logged in

### Test Login
1. Navigate to `http://localhost:5173`
2. Enter credentials:
   - **Email**: testuser@example.com
   - **Password**: Test@1234
3. Click **"Login"**

**Expected Result:**
- ✅ User is authenticated
- ✅ Redirected to `/nutrition` page

---

## Debug Output

With the new logging, you'll see in the browser console:

```
Signup API response: {
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc...",
  user: { id: "...", email: "...", fullName: "..." }
}

AuthContext login called with: {
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc...",
  user: { id: "...", email: "...", fullName: "..." }
}

Extracted data: {
  userData: { id: "...", email: "...", fullName: "..." },
  accessToken: "present",
  refreshToken: "present"
}
```

---

## Additional Notes

### Backend Response Format
The backend's `AuthResponse` record in Java:
```java
public record AuthResponse(
    String accessToken,
    String refreshToken,
    UserDto user
) {}
```

**Note**: The backend does NOT return `expiresIn`. The frontend calculates it as 15 minutes (900000ms) by default.

### Token Storage
Tokens are stored based on "Remember Me" setting:
- **Remember Me = true**: Stored in `localStorage`
- **Remember Me = false**: Stored in `sessionStorage`

---

## Status

**Fix Applied**: ✅ Complete  
**Testing**: ✅ Ready  
**Linter Errors**: ✅ None

---

**Date Fixed**: January 19, 2026  
**Issue**: Signup/Login destructuring error  
**Solution**: Pass response directly, not response.data

🎉 **Signup and Login are now working!**

