/**
 * Data Models and Type Definitions
 * These define the structure of data exchanged with the backend API
 */

/**
 * User Model
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} fullName - User's full name
 * @property {string} [avatar] - Optional avatar URL
 * @property {Date} createdAt - Account creation date
 * @property {Date} updatedAt - Last update date
 * @property {UserPreferences} [preferences] - User preferences
 */

/**
 * User Preferences
 * @typedef {Object} UserPreferences
 * @property {number} dailyCalorieGoal - Daily calorie target
 * @property {MacroGoals} macroGoals - Macro nutrient goals
 * @property {number} waterGoal - Daily water intake goal (in glasses)
 * @property {string} theme - UI theme preference
 */

/**
 * Macro Goals
 * @typedef {Object} MacroGoals
 * @property {number} protein - Daily protein goal in grams
 * @property {number} carbs - Daily carbs goal in grams
 * @property {number} fats - Daily fats goal in grams
 */

/**
 * Authentication Response
 * @typedef {Object} AuthResponse
 * @property {User} user - User data
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 * @property {number} expiresIn - Token expiry time in seconds
 */

/**
 * Login Credentials
 * @typedef {Object} LoginCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {boolean} [rememberMe] - Remember user session
 */

/**
 * Signup Data
 * @typedef {Object} SignupData
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {string} fullName - User's full name
 * @property {boolean} agreeToTerms - Terms acceptance
 */

/**
 * Chat Model
 * @typedef {Object} Chat
 * @property {string} id - Unique chat identifier
 * @property {string} userId - User who owns this chat
 * @property {string} title - Chat title
 * @property {Message[]} messages - Chat messages
 * @property {Date} createdAt - Chat creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * Message Model
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {string} chatId - Parent chat ID
 * @property {'user'|'assistant'} sender - Message sender type
 * @property {string} text - Message text content
 * @property {Attachment} [attachment] - Optional attachment
 * @property {Date} timestamp - Message timestamp
 */

/**
 * Attachment Model
 * @typedef {Object} Attachment
 * @property {string} name - File name
 * @property {string} type - MIME type
 * @property {number} size - File size in bytes
 * @property {string} url - File URL (set by backend after upload)
 */

/**
 * Meal Model
 * @typedef {Object} Meal
 * @property {string} id - Unique meal identifier
 * @property {string} userId - User who logged this meal
 * @property {'breakfast'|'lunch'|'dinner'|'snack'} type - Meal type
 * @property {string} name - Meal name/description
 * @property {number} calories - Total calories
 * @property {Macros} macros - Macro nutrients
 * @property {string} time - Time of meal (HH:mm format)
 * @property {Date} date - Date of meal
 * @property {Date} createdAt - Log creation date
 */

/**
 * Macros Model
 * @typedef {Object} Macros
 * @property {number} protein - Protein in grams
 * @property {number} carbs - Carbs in grams
 * @property {number} fats - Fats in grams
 */

/**
 * Water Intake Model
 * @typedef {Object} WaterIntake
 * @property {string} id - Unique identifier
 * @property {string} userId - User ID
 * @property {number} glasses - Number of glasses consumed
 * @property {Date} date - Date of intake
 * @property {Date} updatedAt - Last update date
 */

/**
 * Task List Model
 * @typedef {Object} TaskList
 * @property {string} id - Unique list identifier
 * @property {string} userId - User who owns this list
 * @property {string} name - List name
 * @property {Task[]} tasks - Tasks in this list
 * @property {Date} createdAt - List creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * Task Model
 * @typedef {Object} Task
 * @property {string} id - Unique task identifier
 * @property {string} listId - Parent list ID
 * @property {string} text - Task description
 * @property {'Low'|'Medium'|'High'} priority - Task priority
 * @property {string} [deadline] - Optional deadline (ISO date string)
 * @property {boolean} completed - Completion status
 * @property {boolean} xpGranted - Whether XP was granted
 * @property {Date} createdAt - Task creation date
 * @property {Date} completedAt - Task completion date
 */

/**
 * User Stats Model (for gamification)
 * @typedef {Object} UserStats
 * @property {string} userId - User ID
 * @property {number} xp - Total XP earned
 * @property {number} level - Current level
 * @property {number} tasksCompleted - Total tasks completed
 * @property {number} streak - Current streak in days
 * @property {Date} lastActivity - Last activity date
 */

/**
 * Leaderboard Entry
 * @typedef {Object} LeaderboardEntry
 * @property {string} userId - User ID
 * @property {string} fullName - User's name
 * @property {string} [avatar] - User's avatar
 * @property {number} xp - Total XP
 * @property {number} level - Current level
 * @property {number} rank - Current rank
 */

/**
 * API Error Response
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 * @property {number} statusCode - HTTP status code
 * @property {Object} [details] - Additional error details
 */

/**
 * API Success Response
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Success indicator
 * @property {*} data - Response data
 * @property {string} [message] - Optional message
 */

/**
 * Pagination Info
 * @typedef {Object} PaginationInfo
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} total - Total items
 * @property {number} totalPages - Total pages
 */

/**
 * Paginated Response
 * @typedef {Object} PaginatedResponse
 * @property {Array} data - Array of items
 * @property {PaginationInfo} pagination - Pagination info
 */

// Export empty object to make this a module
export {};
