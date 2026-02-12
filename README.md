# Wellbeing App Frontend

A modern React-based wellbeing application featuring AI chat assistance, nutrition tracking, and task management with gamification.

## Features

- 🤖 **AI Chat Assistant** - Interactive wellbeing companion
- 🥗 **Nutrition Tracking** - Smart meal tracking with macro and calorie monitoring
- ✅ **Task Management** - Gamified task system with XP and leveling
- 🔐 **Authentication** - Secure login and signup system
- 📱 **Responsive Design** - Device-specific UX for desktop, tablet, and mobile
- 🎯 **Touch Optimized** - Native-feel interactions on touch devices
- ✨ **Smooth Animations** - Modern UI with Framer Motion

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Framer Motion** - Animations
- **CSS Modules** - Scoped styling

## Responsive Design

The app is optimized for all devices with device-specific UX:

### Breakpoints
- **Wide Desktop**: 1536px+
- **Desktop**: 1280px - 1535px
- **Laptop**: 1024px - 1279px
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

### Device-Specific Features
- **Touch devices**: Larger touch targets (44px min), touch feedback, no hover effects
- **Desktop**: Hover interactions, smaller click targets, scrollbar styling
- **Mobile**: Bottom sheet modals, safe area handling for notched devices
- **Reduced motion**: Respects user's motion preferences

### Using Device Detection in Components

```jsx
import { useDevice, useBreakpoint } from './hooks/useDevice';

function MyComponent() {
  const { isMobile, isTouch, orientation } = useDevice();
  const isTabletOrBelow = useBreakpoint('tablet');
  
  return (
    <div className={isMobile ? styles.mobile : styles.desktop}>
      {isTouch && <TouchOnlyFeature />}
    </div>
  );
}
```

### CSS Device Classes

The app automatically applies classes to the HTML element:
- Device type: `.mobile-small`, `.mobile`, `.tablet`, `.laptop`, `.desktop`, `.wide`
- Touch: `.touch` or `.no-touch`
- Orientation: `.portrait` or `.landscape`

Use in CSS:
```css
/* Touch-only styles */
:global(.touch) .button {
  min-height: 48px;
}

/* Desktop-only hover */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-2px);
  }
}
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd wellbeingapp-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables (see Configuration section)

5. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_AUTH_TOKEN_KEY=wellbeing_auth_token
VITE_REMEMBER_ME_KEY=wellbeing_remember_me

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# Environment
VITE_APP_ENV=development
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Chat/           # Chat interface components
│   ├── Nutrition/      # Nutrition tracking components
│   ├── Tasks/          # Task management components
│   └── ErrorBoundary.jsx # Error handling component
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Page components
├── services/           # API service layer
│   └── api.js          # Centralized API client
├── utils/              # Utility functions
└── App.jsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses session-based authentication. Currently, authentication is mocked for development. To integrate with a backend:

1. Update `src/services/api.js` with your API endpoints
2. Modify `src/context/AuthContext.jsx` to use the API service
3. Update login/signup components to call the API

## Protected Routes

Routes like `/chat`, `/nutrition`, and `/tasks` are protected and require authentication. Unauthenticated users are redirected to `/login`.

## API Integration

The project includes a service layer in `src/services/api.js` for backend integration. Currently, the app uses localStorage for data persistence. To connect to a backend:

1. Set `VITE_API_BASE_URL` in your `.env` file
2. Update components to use the API service instead of localStorage
3. Implement proper error handling

## Error Handling

The app includes an ErrorBoundary component that catches React errors and displays a user-friendly error page. In development mode, it also shows error details.

## Recent Updates (Jan 2026)

### ✅ Critical Changes for Backend Integration

The frontend has been significantly enhanced to prepare for backend integration:

1. **Environment Configuration**
   - Added `.env.example` with all required variables
   - Centralized configuration management

2. **Enhanced API Service**
   - Automatic JWT token refresh
   - Proper error handling with custom error classes
   - Request/response interceptors
   - Token management utilities

3. **Authentication Context**
   - Updated to handle JWT tokens properly
   - Support for "Remember Me" functionality
   - Automatic token validation

4. **Utility Functions**
   - `src/utils/constants.js` - All app constants
   - `src/utils/errorHandler.js` - Error handling utilities
   - `src/utils/validation.js` - Form validation functions

5. **Type Definitions**
   - `src/types/models.js` - Data models matching backend API

6. **Documentation**
   - `BACKEND_API_REQUIREMENTS.md` - Complete API specification for backend team
   - `CRITICAL_CHANGES_SUMMARY.md` - Detailed change documentation

### 📋 Next Steps

**For Frontend Developers:**
1. Update Login/Signup components to use real API
2. Replace localStorage with API calls in feature components
3. Add loading and error states to all API interactions
4. Test error scenarios thoroughly

**For Backend Developers:**
1. Review `BACKEND_API_REQUIREMENTS.md`
2. Implement authentication endpoints first
3. Set up CORS to allow frontend origin
4. Follow the API contracts defined in the requirements

See `CRITICAL_CHANGES_SUMMARY.md` for detailed migration guide.

## Development Notes

- ⚠️ **Authentication is currently mocked** - needs real API integration
- ⚠️ **Data persistence uses localStorage** - needs backend integration
- ✅ API service layer is ready with token management
- ✅ Error handling utilities are implemented
- ✅ Validation utilities are ready to use
- ✅ CSS Modules are used for component styling

## Project Structure (Updated)

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components (needs API update)
│   ├── Chat/           # Chat interface (needs API update)
│   ├── Nutrition/      # Nutrition tracking (needs API update)
│   ├── Tasks/          # Task management (needs API update)
│   └── ErrorBoundary.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx # ✅ Updated with JWT token management
│   └── ProtectedRoute.jsx
├── pages/              # Page components
├── services/           # API service layer
│   └── api.js          # ✅ Enhanced with interceptors & token refresh
├── types/              # ✅ NEW: Type definitions
│   └── models.js       # Data models for API contracts
├── utils/              # ✅ NEW: Utility functions
│   ├── constants.js    # Application constants
│   ├── errorHandler.js # Error handling utilities
│   ├── validation.js   # Validation functions
│   └── nutritionUtils.js
└── App.jsx             # Main application component
```

## Environment Setup

1. Copy environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your values:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
# ... see .env.example for all options
```

## Backend Integration Guide

### Authentication Flow

```javascript
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { handleError } from './utils/errorHandler';

// Login
try {
  const response = await api.auth.login({ email, password, rememberMe });
  login(response, rememberMe); // From useAuth hook
} catch (error) {
  const message = handleError(error);
  showError(message);
}

// Logout
logout(); // Automatically clears tokens
```

### Making API Calls

```javascript
import api from './services/api';
import { handleError } from './utils/errorHandler';

try {
  const data = await api.nutrition.getMeals('2026-01-15');
  setMeals(data.data);
} catch (error) {
  const message = handleError(error);
  setError(message);
}
```

### Form Validation

```javascript
import { validateLoginForm } from './utils/validation';

const { isValid, errors } = validateLoginForm(email, password);
if (!isValid) {
  setErrors(errors);
  return;
}
```

## Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] Signup new account
- [ ] Token refresh on 401 (automatic)
- [ ] Logout clears all data
- [ ] Protected routes redirect to login
- [ ] API errors show user-friendly messages

### Future Testing
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add integration tests
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Set up CI/CD with test automation

## Future Improvements

### High Priority
- [ ] Connect all components to backend API
- [ ] Implement real authentication flow
- [ ] Add loading states for all async operations
- [ ] Implement proper error boundaries

### Medium Priority
- [ ] Add unit and integration tests
- [ ] Migrate to TypeScript
- [ ] Implement offline support with service workers
- [ ] Add PWA capabilities

### Low Priority
- [ ] Set up error logging service (Sentry)
- [ ] Add analytics integration
- [ ] Implement i18n (internationalization)
- [ ] Add accessibility improvements

## Troubleshooting

### CORS Errors
Ensure backend allows:
- Origin: `http://localhost:5173`
- Headers: `Authorization`, `Content-Type`
- Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

### Token Issues
- Check token is stored in sessionStorage/localStorage
- Verify token format: `Bearer <token>`
- Check token expiry times match backend

### API Errors
- Check `BACKEND_API_REQUIREMENTS.md` for expected formats
- Verify error responses match expected structure
- Check network tab for actual responses

## Documentation

- `README.md` - This file
- `BACKEND_API_REQUIREMENTS.md` - Complete API specification
- `CRITICAL_CHANGES_SUMMARY.md` - Detailed change log and migration guide
- `SUGGESTIONS.md` - Previous suggestions and improvements

## License

[Your License Here]
