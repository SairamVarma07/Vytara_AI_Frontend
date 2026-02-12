/**
 * Application Constants
 * Centralized constants to avoid magic strings and numbers
 */

// ===========================================
// Environment & Configuration
// ===========================================
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.0.1',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
};

// ===========================================
// Storage Keys
// ===========================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN_KEY || 'vytara_auth_token',
  REFRESH_TOKEN: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'vytara_refresh_token',
  USER_DATA: import.meta.env.VITE_USER_DATA_KEY || 'vytara_user_data',
  REMEMBER_ME: 'vytara_remember_me',
  THEME: 'vytara_theme',
};

// ===========================================
// Authentication
// ===========================================
export const AUTH = {
  TOKEN_EXPIRY: Number(import.meta.env.VITE_TOKEN_EXPIRY) || 900000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: Number(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY) || 604800000, // 7 days
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
};

// ===========================================
// API Routes
// ===========================================
export const API_ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Chat
  CHATS: '/chat',
  CHAT_DETAIL: (id) => `/chat/${id}`,
  CHAT_MESSAGES: (id) => `/chat/${id}/messages`,
  
  // Nutrition
  MEALS: '/nutrition/meals',
  MEAL_DETAIL: (id) => `/nutrition/meals/${id}`,
  DAILY_GOAL: '/nutrition/goal',
  WATER_INTAKE: '/nutrition/water',
  NUTRITION_STATS: '/nutrition/stats',
  
  // Tasks
  TASK_LISTS: '/tasks/lists',
  TASK_LIST_DETAIL: (id) => `/tasks/lists/${id}`,
  TASKS: (listId) => `/tasks/lists/${listId}/tasks`,
  TASK_DETAIL: (listId, taskId) => `/tasks/lists/${listId}/tasks/${taskId}`,
  USER_STATS: '/tasks/stats',
  LEADERBOARD: '/tasks/leaderboard',
};

// ===========================================
// HTTP Status Codes
// ===========================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ===========================================
// Error Messages
// ===========================================
export const ERROR_MESSAGES = {
  // Network
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  
  // Validation
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  INVALID_FORMAT: 'Invalid format.',
  
  // Generic
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NOT_FOUND: 'Resource not found.',
};

// ===========================================
// Success Messages
// ===========================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  MEAL_ADDED: 'Meal logged successfully.',
  TASK_COMPLETED: 'Task completed!',
  GOAL_UPDATED: 'Goal updated successfully.',
};

// ===========================================
// Nutrition
// ===========================================
export const NUTRITION = {
  DEFAULT_CALORIE_GOAL: Number(import.meta.env.VITE_DEFAULT_CALORIE_GOAL) || 2000,
  DEFAULT_PROTEIN_GOAL: Number(import.meta.env.VITE_DEFAULT_PROTEIN_GOAL) || 150,
  DEFAULT_CARBS_GOAL: Number(import.meta.env.VITE_DEFAULT_CARBS_GOAL) || 200,
  DEFAULT_FATS_GOAL: Number(import.meta.env.VITE_DEFAULT_FATS_GOAL) || 65,
  DEFAULT_WATER_GOAL: Number(import.meta.env.VITE_DEFAULT_WATER_GOAL) || 8,
  
  MEAL_TYPES: {
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    DINNER: 'dinner',
    SNACK: 'snack',
  },
  
  CALORIES_PER_GRAM: {
    PROTEIN: 4,
    CARBS: 4,
    FATS: 9,
  },
};

// ===========================================
// Tasks & Gamification
// ===========================================
export const TASKS = {
  XP_HIGH_PRIORITY: Number(import.meta.env.VITE_XP_HIGH_PRIORITY) || 30,
  XP_MEDIUM_PRIORITY: Number(import.meta.env.VITE_XP_MEDIUM_PRIORITY) || 20,
  XP_LOW_PRIORITY: Number(import.meta.env.VITE_XP_LOW_PRIORITY) || 10,
  XP_PER_LEVEL: Number(import.meta.env.VITE_XP_PER_LEVEL) || 100,
  
  PRIORITY_LEVELS: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  },
  
  MAX_TASK_LENGTH: 500,
  MAX_LIST_NAME_LENGTH: 100,
};

// ===========================================
// Chat
// ===========================================
export const CHAT = {
  MAX_FILE_SIZE: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/png,image/jpeg,image/jpg,image/gif,application/pdf').split(','),
  MAX_MESSAGE_LENGTH: 5000,
  TYPING_INDICATOR_DELAY: 1500, // milliseconds
};

// ===========================================
// UI Constants
// ===========================================
export const UI = {
  TOAST_DURATION: 3000, // milliseconds
  MODAL_ANIMATION_DURATION: 300, // milliseconds
  DEBOUNCE_DELAY: 300, // milliseconds
  LOADING_SPINNER_DELAY: 200, // milliseconds
};

// ===========================================
// Regex Patterns
// ===========================================
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// ===========================================
// Date & Time
// ===========================================
export const DATE_FORMAT = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
};

// ===========================================
// Pagination
// ===========================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// ===========================================
// Feature Flags
// ===========================================
export const FEATURES = {
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',
};

// ===========================================
// Routes
// ===========================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CHAT: '/chat',
  NUTRITION: '/nutrition',
  TASKS: '/tasks',
  PROFILE: '/profile',
};

