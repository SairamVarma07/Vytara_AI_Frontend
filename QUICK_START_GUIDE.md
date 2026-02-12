# Quick Start Guide - Backend Integration

## 🚀 For Frontend Developers

### 1. Setup Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Update .env with backend URL
# VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Update Login Component (5 minutes)

**File:** `src/components/Auth/Login.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { handleError } from '../../utils/errorHandler';
import { validateLoginForm } from '../../utils/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate
    const { isValid, errors } = validateLoginForm(email, password);
    if (!isValid) {
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.auth.login({ email, password, rememberMe });
      login(response, rememberMe);
      navigate('/');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
  // Add: {error && <div className={styles.error}>{error}</div>}
  // Add: disabled={loading} to submit button
}
```

### 3. Update Signup Component (5 minutes)

**File:** `src/components/Auth/SignupModal.jsx`

```javascript
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { handleError } from '../../utils/errorHandler';
import { validateSignupForm } from '../../utils/validation';

export default function SignupModal({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const { isValid, errors } = validateSignupForm({ ...formData, agreeTerms });
    if (!isValid) {
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.auth.signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        agreeToTerms: true,
      });
      login(response, false);
      onClose();
      navigate('/');
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 4. Update Nutrition Component (10 minutes)

**File:** `src/components/Nutrition/NutritionLayout.jsx`

```javascript
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { handleError } from '../../utils/errorHandler';

export default function NutritionLayout() {
  const [meals, setMeals] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, goalRes, waterRes] = await Promise.all([
          api.nutrition.getMeals(today),
          api.nutrition.getDailyGoal(),
          api.nutrition.getWaterIntake(today),
        ]);

        setMeals(mealsRes.data);
        setDailyGoal(goalRes.data.dailyCalorieGoal);
        setWaterGlasses(waterRes.data.glasses);
      } catch (err) {
        setError(handleError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [today]);

  // Add meal
  const handleAddMeal = async (mealType, mealName) => {
    if (!mealName.trim()) return;

    try {
      const calories = estimateCalories(mealType, mealName);
      const macros = estimateMacros(calories);

      const response = await api.nutrition.addMeal({
        type: mealType,
        name: mealName,
        calories,
        macros,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: today,
      });

      setMeals([...meals, response.data]);
    } catch (err) {
      setError(handleError(err));
    }
  };

  // Update water
  const handleAddWater = async () => {
    const newGlasses = Math.min(waterGlasses + 1, 8);
    
    try {
      await api.nutrition.updateWaterIntake(newGlasses);
      setWaterGlasses(newGlasses);
    } catch (err) {
      setError(handleError(err));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // ... rest of component
}
```

### 5. Common Patterns

#### API Call with Error Handling
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleAction = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.something.action();
    // Handle success
  } catch (err) {
    setError(handleError(err));
  } finally {
    setLoading(false);
  }
};
```

#### Form Validation
```javascript
import { validateSomething } from '../utils/validation';

const { isValid, errors } = validateSomething(data);
if (!isValid) {
  setErrors(errors);
  return;
}
```

#### Using Constants
```javascript
import { NUTRITION, ERROR_MESSAGES, STORAGE_KEYS } from '../utils/constants';

const goal = NUTRITION.DEFAULT_CALORIE_GOAL;
const errorMsg = ERROR_MESSAGES.NETWORK_ERROR;
```

---

## 🔧 For Backend Developers

### 1. Review Requirements (10 minutes)

Read `BACKEND_API_REQUIREMENTS.md` completely. It contains:
- All API endpoints with examples
- Data models
- Authentication flow
- Error handling format
- Security requirements

### 2. Setup CORS (5 minutes)

```javascript
// Express example
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

### 3. Response Format (CRITICAL)

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "User friendly message",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": { "field": "error message" }
  }
}
```

### 4. Authentication Flow

**Signup/Login Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "avatar": null,
      "preferences": { ... }
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

**Token Refresh:**
- Frontend automatically calls `/api/auth/refresh` on 401
- Return new accessToken and refreshToken
- Frontend will retry original request

### 5. Priority Endpoints

Implement in this order:

1. **Authentication** (Day 1)
   - POST `/api/auth/signup`
   - POST `/api/auth/login`
   - POST `/api/auth/refresh`
   - POST `/api/auth/logout`

2. **User Profile** (Day 1)
   - GET `/api/user/profile`
   - PUT `/api/user/profile`

3. **Nutrition** (Day 2)
   - GET `/api/nutrition/meals?date=YYYY-MM-DD`
   - POST `/api/nutrition/meals`
   - GET `/api/nutrition/goal`
   - PUT `/api/nutrition/goal`
   - GET `/api/nutrition/water?date=YYYY-MM-DD`
   - PUT `/api/nutrition/water`

4. **Tasks** (Day 3)
   - GET `/api/tasks/lists`
   - POST `/api/tasks/lists`
   - GET `/api/tasks/lists/:listId/tasks`
   - POST `/api/tasks/lists/:listId/tasks`
   - PUT `/api/tasks/lists/:listId/tasks/:taskId`
   - GET `/api/tasks/stats`

5. **Chat** (Day 4)
   - GET `/api/chat`
   - POST `/api/chat`
   - GET `/api/chat/:chatId`
   - POST `/api/chat/:chatId/messages`

### 6. Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  avatar TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Meals Table:**
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  calories INTEGER NOT NULL,
  macros JSONB NOT NULL,
  time VARCHAR(5) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meals_user_date ON meals(user_id, date);
```

See `BACKEND_API_REQUIREMENTS.md` for complete schema.

### 7. Testing Endpoints

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "fullName": "Test User",
    "agreeToTerms": true
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'

# Test protected endpoint
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Common Issues

### Frontend: "Network Error"
- Check backend is running
- Check CORS is configured
- Check API_BASE_URL in .env

### Frontend: "401 Unauthorized" loop
- Check token refresh endpoint is working
- Check token format: `Bearer <token>`
- Check token expiry times

### Backend: CORS errors
- Add `Access-Control-Allow-Origin` header
- Handle OPTIONS preflight requests
- Allow `Authorization` header

### Backend: Token validation fails
- Check JWT secret matches
- Check token expiry
- Check token format

---

## 📋 Checklist

### Frontend Team
- [ ] Copy .env.example to .env
- [ ] Update Login component
- [ ] Update Signup component
- [ ] Update Nutrition component
- [ ] Update Tasks component
- [ ] Update Chat component
- [ ] Test all error scenarios
- [ ] Test loading states
- [ ] Test token refresh

### Backend Team
- [ ] Read BACKEND_API_REQUIREMENTS.md
- [ ] Set up CORS
- [ ] Implement auth endpoints
- [ ] Implement user endpoints
- [ ] Implement nutrition endpoints
- [ ] Implement tasks endpoints
- [ ] Implement chat endpoints
- [ ] Test all endpoints with Postman/curl
- [ ] Deploy to staging

---

## 🎯 Success Criteria

✅ User can signup and login
✅ Token refresh works automatically
✅ User can add/view meals
✅ User can create/complete tasks
✅ User can chat with AI assistant
✅ Errors show user-friendly messages
✅ Loading states show during API calls
✅ Protected routes redirect to login

---

## 📞 Need Help?

- Check `BACKEND_API_REQUIREMENTS.md` for API details
- Check `CRITICAL_CHANGES_SUMMARY.md` for detailed changes
- Check code comments in utility files
- Review example implementations above

**Good luck! 🚀**

