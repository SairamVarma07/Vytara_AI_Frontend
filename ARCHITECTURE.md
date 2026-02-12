# Architecture Overview - Vytara Wellbeing App

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:5173                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/HTTPS
                                 │ JSON
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API (REST)                          │
│                     http://localhost:3000/api                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     Auth     │  │   Business   │  │   AI Chat    │          │
│  │   Service    │  │    Logic     │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Database     │
                    │  (PostgreSQL)   │
                    └─────────────────┘
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Interface                          │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Login   │  │   Chat   │  │ Nutrition│  │  Tasks   │       │
│  │   Page   │  │   Page   │  │   Page   │  │   Page   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│       │             │              │              │              │
└───────┼─────────────┼──────────────┼──────────────┼─────────────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────┐          ┌──────────────┐
│   Context    │          │  Components  │
│              │          │              │
│ AuthContext  │          │  Navbar      │
│              │          │  Footer      │
└──────────────┘          │  Modals      │
        │                 │  Forms       │
        │                 └──────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│          Services Layer              │
│                                      │
│  ┌────────────────────────────────┐ │
│  │        API Service             │ │
│  │                                │ │
│  │  • Token Management            │ │
│  │  • Request Interceptors        │ │
│  │  • Response Interceptors       │ │
│  │  • Error Handling              │ │
│  │  • Automatic Token Refresh     │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│          Utilities Layer             │
│                                      │
│  • constants.js                      │
│  • errorHandler.js                   │
│  • validation.js                     │
│  • nutritionUtils.js                 │
└──────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────┐                                              ┌─────────┐
│  User   │                                              │ Backend │
└────┬────┘                                              └────┬────┘
     │                                                        │
     │  1. Enter credentials                                 │
     │────────────────────────────────────────────────────►  │
     │                                                        │
     │                                                        │  2. Validate
     │                                                        │     credentials
     │                                                        │
     │  3. Return user + tokens                              │
     │  ◄────────────────────────────────────────────────────│
     │     {                                                  │
     │       user: {...},                                     │
     │       accessToken: "...",                              │
     │       refreshToken: "..."                              │
     │     }                                                  │
     │                                                        │
     │  4. Store tokens                                      │
     │     (sessionStorage/localStorage)                     │
     │                                                        │
     │  5. Make API request with token                       │
     │────────────────────────────────────────────────────►  │
     │     Authorization: Bearer <accessToken>               │
     │                                                        │
     │  6. Return data                                       │
     │  ◄────────────────────────────────────────────────────│
     │                                                        │
     │  ... time passes, token expires ...                   │
     │                                                        │
     │  7. Make API request (token expired)                  │
     │────────────────────────────────────────────────────►  │
     │                                                        │
     │  8. Return 401 Unauthorized                           │
     │  ◄────────────────────────────────────────────────────│
     │                                                        │
     │  9. Automatically refresh token                       │
     │────────────────────────────────────────────────────►  │
     │     POST /api/auth/refresh                            │
     │     { refreshToken: "..." }                           │
     │                                                        │
     │  10. Return new tokens                                │
     │  ◄────────────────────────────────────────────────────│
     │      { accessToken: "...", refreshToken: "..." }      │
     │                                                        │
     │  11. Retry original request with new token            │
     │────────────────────────────────────────────────────►  │
     │                                                        │
     │  12. Return data                                      │
     │  ◄────────────────────────────────────────────────────│
     │                                                        │
```

---

## API Request Flow

```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       │ 1. Call API function
       │    api.nutrition.getMeals('2026-01-15')
       ▼
┌──────────────────┐
│   API Service    │
│                  │
│  2. Add headers  │
│     - Auth token │
│     - Content-Type
└──────┬───────────┘
       │
       │ 3. Send HTTP request
       ▼
┌──────────────────┐
│  Backend API     │
│                  │
│  4. Process      │
│  5. Return data  │
└──────┬───────────┘
       │
       │ 6. Response
       ▼
┌──────────────────┐
│   API Service    │
│                  │
│  7. Check status │
│  8. Parse error  │
│     if needed    │
└──────┬───────────┘
       │
       │ 9. Return data or throw error
       ▼
┌──────────────────┐
│  Component       │
│                  │
│  10. Update UI   │
│   or show error  │
└──────────────────┘
```

---

## Error Handling Flow

```
┌──────────────┐
│   API Call   │
└──────┬───────┘
       │
       │ Error occurs
       ▼
┌──────────────────────┐
│  API Service         │
│                      │
│  Catch error         │
│  Create ApiError     │
│  or NetworkError     │
└──────┬───────────────┘
       │
       │ Throw error
       ▼
┌──────────────────────┐
│  Component           │
│                      │
│  catch (error) {     │
│    const message =   │
│      handleError(err)│
│  }                   │
└──────┬───────────────┘
       │
       │ Display message
       ▼
┌──────────────────────┐
│  User sees:          │
│  "Network error.     │
│   Please check your  │
│   connection."       │
└──────────────────────┘
```

---

## Data Flow - Nutrition Feature

```
┌─────────────────────────────────────────────────────────┐
│                    Nutrition Page                        │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  Meal Form │  │ Meal List  │  │   Stats    │       │
│  └─────┬──────┘  └─────▲──────┘  └─────▲──────┘       │
│        │                │                │               │
└────────┼────────────────┼────────────────┼──────────────┘
         │                │                │
         │ Add Meal       │ Display        │ Calculate
         │                │                │
         ▼                │                │
    ┌────────────────────┴────────────────┴──────┐
    │         NutritionLayout State              │
    │                                            │
    │  meals: []                                 │
    │  dailyGoal: 2000                          │
    │  waterGlasses: 0                          │
    └────────────────┬───────────────────────────┘
                     │
                     │ API Calls
                     ▼
    ┌────────────────────────────────────────────┐
    │            API Service                     │
    │                                            │
    │  • getMeals(date)                         │
    │  • addMeal(mealData)                      │
    │  • getDailyGoal()                         │
    │  • updateWaterIntake(glasses)             │
    └────────────────┬───────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────┐
    │            Backend API                     │
    │                                            │
    │  GET  /api/nutrition/meals?date=...       │
    │  POST /api/nutrition/meals                │
    │  GET  /api/nutrition/goal                 │
    │  PUT  /api/nutrition/water                │
    └────────────────┬───────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────┐
    │            Database                        │
    │                                            │
    │  meals table                               │
    │  user_preferences table                    │
    │  water_intake table                        │
    └────────────────────────────────────────────┘
```

---

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Application State                     │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Global     │  │   Feature    │  │    Local     │
│    State     │  │    State     │  │    State     │
│              │  │              │  │              │
│ AuthContext  │  │ Nutrition    │  │ Form inputs  │
│  - user      │  │  - meals     │  │ - loading    │
│  - isAuth    │  │  - goals     │  │ - errors     │
│  - loading   │  │              │  │ - modals     │
│              │  │ Tasks        │  │              │
│              │  │  - lists     │  │              │
│              │  │  - tasks     │  │              │
│              │  │  - xp        │  │              │
│              │  │              │  │              │
│              │  │ Chat         │  │              │
│              │  │  - chats     │  │              │
│              │  │  - messages  │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## File Structure

```
src/
├── components/              # UI Components
│   ├── Auth/
│   │   ├── Login.jsx       # ⚠️ Needs API update
│   │   └── SignupModal.jsx # ⚠️ Needs API update
│   ├── Chat/
│   │   ├── ChatLayout.jsx  # ⚠️ Needs API update
│   │   ├── ChatWindow.jsx
│   │   └── ChatSidebar.jsx
│   ├── Nutrition/
│   │   ├── NutritionLayout.jsx # ⚠️ Needs API update
│   │   ├── MealForm.jsx
│   │   └── MealList.jsx
│   ├── Tasks/
│   │   ├── TasksLayout.jsx # ⚠️ Needs API update
│   │   ├── TaskList.jsx
│   │   └── TaskItem.jsx
│   └── ErrorBoundary.jsx
│
├── context/                 # React Context
│   ├── AuthContext.jsx     # ✅ Updated
│   └── ProtectedRoute.jsx
│
├── services/                # API Layer
│   └── api.js              # ✅ Enhanced
│
├── types/                   # ✅ NEW
│   └── models.js           # Data models
│
├── utils/                   # ✅ NEW
│   ├── constants.js        # App constants
│   ├── errorHandler.js     # Error utilities
│   ├── validation.js       # Validation utilities
│   └── nutritionUtils.js   # Nutrition helpers
│
├── pages/                   # Page components
│   ├── Home.jsx
│   ├── ChatPage.jsx
│   ├── NutritionPage.jsx
│   └── TasksPage.jsx
│
└── App.jsx                  # Main app
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
└─────────────────────────────────────────────────────────┘

1. Input Validation (Frontend)
   ├── Email format validation
   ├── Password strength validation
   ├── Input sanitization
   └── File type/size validation

2. Authentication (Frontend)
   ├── JWT token storage
   ├── Automatic token refresh
   ├── Secure token transmission
   └── Token expiry handling

3. Protected Routes (Frontend)
   ├── Check authentication before render
   ├── Redirect to login if not authenticated
   └── Show loading state during check

4. API Security (Backend - Required)
   ├── HTTPS in production
   ├── CORS configuration
   ├── Rate limiting
   ├── Input validation
   ├── SQL injection prevention
   ├── XSS protection
   └── CSRF protection

5. Data Security (Backend - Required)
   ├── Password hashing (bcrypt)
   ├── Token encryption
   ├── Secure session management
   └── Data encryption at rest
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────┐
│                Performance Strategies                    │
└─────────────────────────────────────────────────────────┘

Frontend:
├── Code Splitting (React.lazy)
├── Memoization (React.memo, useMemo)
├── Debouncing (search inputs)
├── Lazy Loading (images, components)
├── CSS Modules (scoped styles)
└── Vite (fast build tool)

Backend (Recommended):
├── Database Indexing
├── Query Optimization
├── Response Caching
├── Connection Pooling
├── Compression (gzip)
└── CDN for static assets
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Production                           │
└─────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify):
├── Build: npm run build
├── Deploy: Automatic from Git
├── CDN: Global edge network
└── HTTPS: Automatic SSL

Backend (AWS/Heroku/DigitalOcean):
├── Server: Node.js/Express
├── Database: PostgreSQL
├── Cache: Redis (optional)
├── Storage: S3 (for file uploads)
└── HTTPS: SSL certificate

Environment Variables:
├── Frontend: VITE_API_BASE_URL=https://api.vytara.com
├── Backend: DATABASE_URL, JWT_SECRET, etc.
└── Separate configs for dev/staging/prod
```

---

## Monitoring & Logging

```
┌─────────────────────────────────────────────────────────┐
│              Monitoring Architecture                     │
└─────────────────────────────────────────────────────────┘

Frontend:
├── Error Tracking: Sentry (optional)
├── Analytics: Google Analytics (optional)
├── Performance: Web Vitals
└── Console Logs: Development only

Backend:
├── Error Tracking: Sentry/Rollbar
├── Logging: Winston/Bunyan
├── Monitoring: New Relic/DataDog
├── Uptime: Pingdom/UptimeRobot
└── Database: Query performance monitoring
```

---

## Testing Strategy

```
┌─────────────────────────────────────────────────────────┐
│                  Testing Pyramid                         │
└─────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │   E2E    │  Playwright/Cypress
                    │  Tests   │  (User flows)
                    └──────────┘
                  ┌──────────────┐
                  │ Integration  │  React Testing Library
                  │    Tests     │  (Component + API)
                  └──────────────┘
              ┌────────────────────┐
              │    Unit Tests      │  Jest/Vitest
              │  (Utils, Helpers)  │  (Pure functions)
              └────────────────────┘

Frontend Testing:
├── Unit: Validation, error handling, utilities
├── Integration: Components with API mocks
└── E2E: Complete user flows

Backend Testing:
├── Unit: Business logic, utilities
├── Integration: API endpoints
└── E2E: Complete API flows
```

---

## Future Enhancements

```
┌─────────────────────────────────────────────────────────┐
│                  Roadmap Architecture                    │
└─────────────────────────────────────────────────────────┘

Phase 1 (Current):
├── ✅ JWT Authentication
├── ✅ Error Handling
├── ✅ Validation
├── ⏳ Backend Integration
└── ⏳ Basic Features

Phase 2:
├── TypeScript Migration
├── Unit Testing
├── Performance Optimization
└── PWA Support

Phase 3:
├── WebSocket (Real-time chat)
├── Offline Support
├── Push Notifications
└── Advanced Analytics

Phase 4:
├── Mobile App (React Native)
├── AI Improvements
├── Social Features
└── Integrations (Fitbit, etc.)
```

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Secure**: Multiple security layers
- **Performant**: Optimized for speed
- **Testable**: Easy to write tests
- **Production-ready**: Following best practices

