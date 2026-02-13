/**
 * API Service Layer
 * Centralized API communication for the application
 */

import { STORAGE_KEYS, HTTP_STATUS, API_ROUTES } from "../utils/constants";
import { ApiError, NetworkError, logError } from "../utils/errorHandler";

// Directly access Vite environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

/**
 * Resolve avatar URL for display (img src). Backend returns paths like /uploads/filename.
 * Converts to full API URL when needed so images load from the API origin.
 */
export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (typeof avatar === "string" && avatar.startsWith("http")) return avatar;
  const base = API_BASE_URL.replace(/\/$/, "");
  return base + (avatar.startsWith("/") ? avatar : `/${avatar}`);
};

// Track if token refresh is in progress
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Create a timeout promise
 */
const createTimeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), ms);
  });
};

/**
 * Get authentication token from storage
 */
const getAuthToken = () => {
  // Check session storage first, then local storage (for "remember me")
  return (
    sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  );
};

/**
 * Get refresh token from storage
 */
const getRefreshToken = () => {
  return (
    sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  );
};

/**
 * Set authentication tokens
 */
const setAuthTokens = (accessToken, refreshToken, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
  if (refreshToken) {
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Clear authentication tokens
 */
const clearAuthTokens = () => {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Subscribe to token refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify subscribers when token is refreshed
 */
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

/**
 * Refresh the access token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new ApiError("No refresh token available", HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new ApiError("Token refresh failed", response.status);
    }

    const jsonResponse = await response.json();
    // Extract data from ApiResponse wrapper
    const data =
      jsonResponse.data !== undefined ? jsonResponse.data : jsonResponse;
    const { accessToken, refreshToken: newRefreshToken } = data;

    // Determine if we should use localStorage (if refresh token was in localStorage)
    const rememberMe = !!localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    setAuthTokens(accessToken, newRefreshToken, rememberMe);

    return accessToken;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
};

/**
 * Make a file upload request with automatic token refresh
 * Uses FormData and doesn't set Content-Type (browser sets it with boundary)
 */
const uploadRequest = async (endpoint, file, fieldName = "file") => {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAuthToken();

  const formData = new FormData();
  formData.append(fieldName, file);

  const config = {
    method: "POST",
    headers: {},
  };

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  config.body = formData;

  try {
    const response = await Promise.race([
      fetch(url, config),
      createTimeout(API_TIMEOUT * 3), // Triple timeout for file uploads
    ]);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === HTTP_STATUS.UNAUTHORIZED && token) {
      const newToken = await refreshAccessToken();
      config.headers["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, config);

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "Upload failed",
          retryResponse.status,
          errorData.code,
          errorData.details,
        );
      }

      const retryJsonResponse = await retryResponse.json();
      return retryJsonResponse.data !== undefined
        ? retryJsonResponse.data
        : retryJsonResponse;
    }

    // Handle other HTTP errors (parse body safely in case of HTML/plain text)
    if (!response.ok) {
      const text = await response.text();
      let errorData = {};
      try {
        errorData = text ? JSON.parse(text) : {};
      } catch (_) {
        errorData = {
          message: response.statusText || `Upload failed (${response.status})`,
        };
      }
      const error = new ApiError(
        errorData.message ||
          `Upload failed (${response.status}). Check that the upload endpoint is available.`,
        response.status,
        errorData.code,
        errorData.details,
      );
      logError(error, { endpoint, method: "POST (upload)" });
      throw error;
    }

    // Parse response and extract data from ApiResponse wrapper
    let jsonResponse;
    try {
      jsonResponse = await response.json();
    } catch (parseErr) {
      const err = new ApiError("Invalid response from server", 502);
      logError(err, { endpoint, originalError: parseErr });
      throw err;
    }
    return jsonResponse.data !== undefined ? jsonResponse.data : jsonResponse;
  } catch (error) {
    // Handle timeout
    if (error.message === "Request timeout") {
      const timeoutError = new NetworkError(
        "Upload timed out. Please try again with a smaller file.",
      );
      logError(timeoutError, { endpoint });
      throw timeoutError;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      const networkError = new NetworkError(
        "Network error. Please check your connection.",
      );
      logError(networkError, { endpoint });
      throw networkError;
    }

    // Re-throw ApiError and NetworkError
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error;
    }

    // Wrap unknown errors
    const unknownError = new ApiError(
      error.message || "An unexpected error occurred",
      500,
    );
    logError(unknownError, { endpoint, originalError: error });
    throw unknownError;
  }
};

/**
 * Make an API request with automatic token refresh
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await Promise.race([
      fetch(url, config),
      createTimeout(API_TIMEOUT),
    ]);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === HTTP_STATUS.UNAUTHORIZED && token) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);

          // Retry original request with new token
          config.headers["Authorization"] = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, config);

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new ApiError(
              errorData.message || "Request failed",
              retryResponse.status,
              errorData.code,
              errorData.details,
            );
          }

          const retryJsonResponse = await retryResponse.json();
          return retryJsonResponse.data !== undefined
            ? retryJsonResponse.data
            : retryJsonResponse;
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          // Redirect to login if refresh fails
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          throw new ApiError(
            "Session expired. Please log in again.",
            HTTP_STATUS.UNAUTHORIZED,
          );
        }
      } else {
        // Wait for token refresh to complete
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async (newToken) => {
            try {
              config.headers["Authorization"] = `Bearer ${newToken}`;
              const retryResponse = await fetch(url, config);

              if (!retryResponse.ok) {
                const errorData = await retryResponse.json().catch(() => ({}));
                reject(
                  new ApiError(
                    errorData.message || "Request failed",
                    retryResponse.status,
                    errorData.code,
                    errorData.details,
                  ),
                );
              } else {
                const subscribeJsonResponse = await retryResponse.json();
                resolve(
                  subscribeJsonResponse.data !== undefined
                    ? subscribeJsonResponse.data
                    : subscribeJsonResponse,
                );
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    // Handle other HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData.code,
        errorData.details,
      );
      logError(error, { endpoint, method: options.method || "GET" });
      throw error;
    }

    // Parse response and extract data from ApiResponse wrapper
    const jsonResponse = await response.json();

    // Backend wraps all responses in { success, data, message }
    // Extract the data property if it exists, otherwise return full response
    return jsonResponse.data !== undefined ? jsonResponse.data : jsonResponse;
  } catch (error) {
    // Handle timeout
    if (error.message === "Request timeout") {
      const timeoutError = new NetworkError(
        "Request timed out. Please try again.",
      );
      logError(timeoutError, { endpoint });
      throw timeoutError;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      const networkError = new NetworkError(
        "Network error. Please check your connection.",
      );
      logError(networkError, { endpoint });
      throw networkError;
    }

    // Re-throw ApiError and NetworkError
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error;
    }

    // Wrap unknown errors
    const unknownError = new ApiError(
      error.message || "An unexpected error occurred",
      500,
    );
    logError(unknownError, { endpoint, originalError: error });
    throw unknownError;
  }
};

/**
 * API Methods
 */
export const api = {
  // Authentication
  auth: {
    login: (credentials) =>
      apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    signup: (userData) =>
      apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    logout: () => apiRequest("/auth/logout", { method: "POST" }),
    refreshToken: () => apiRequest("/auth/refresh", { method: "POST" }),
  },

  // Chat
  chat: {
    getChats: () => apiRequest("/chat"),
    getChat: (chatId) => apiRequest(`/chat/${chatId}`),
    createChat: (data) =>
      apiRequest("/chat", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    sendMessage: (chatId, message) =>
      apiRequest(`/chat/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify(message),
      }),
    deleteChat: (chatId) => apiRequest(`/chat/${chatId}`, { method: "DELETE" }),
  },

  // Nutrition
  nutrition: {
    getMeals: (date) => apiRequest(`/nutrition/meals?date=${date}`),
    addMeal: (meal) =>
      apiRequest("/nutrition/meals", {
        method: "POST",
        body: JSON.stringify(meal),
      }),
    updateMeal: (mealId, meal) =>
      apiRequest(`/nutrition/meals/${mealId}`, {
        method: "PUT",
        body: JSON.stringify(meal),
      }),
    deleteMeal: (mealId) =>
      apiRequest(`/nutrition/meals/${mealId}`, { method: "DELETE" }),
    // Daily goals endpoint
    getDailyGoal: () => apiRequest("/nutrition/goal"),
    updateDailyGoal: (goal) =>
      apiRequest("/nutrition/goal", {
        method: "PUT",
        body: JSON.stringify(goal),
      }),
    getWaterIntake: (date) => apiRequest(`/nutrition/water?date=${date}`),
    // Update water intake (backend uses PUT)
    updateWaterIntake: (waterData) =>
      apiRequest("/nutrition/water", {
        method: "PUT",
        body: JSON.stringify(waterData),
      }),
    getNutritionStats: (startDate, endDate) =>
      apiRequest(`/nutrition/stats?startDate=${startDate}&endDate=${endDate}`),
    // Estimate calories/macros (backend calls Python NER service or fallback heuristic)
    estimate: (mealName, mealType) =>
      apiRequest("/nutrition/estimate", {
        method: "POST",
        body: JSON.stringify({
          mealName: mealName || "",
          mealType: mealType || "Lunch",
        }),
      }),
  },

  // Tasks
  tasks: {
    getTaskLists: () => apiRequest("/tasks/lists"),
    createTaskList: (name) =>
      apiRequest("/tasks/lists", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    updateTaskList: (listId, name) =>
      apiRequest(`/tasks/lists/${listId}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      }),
    deleteTaskList: (listId) =>
      apiRequest(`/tasks/lists/${listId}`, { method: "DELETE" }),
    getTasks: (listId) => apiRequest(`/tasks/lists/${listId}/tasks`),
    addTask: (listId, task) =>
      apiRequest(`/tasks/lists/${listId}/tasks`, {
        method: "POST",
        body: JSON.stringify(task),
      }),
    updateTask: (listId, taskId, task) =>
      apiRequest(`/tasks/lists/${listId}/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(task),
      }),
    deleteTask: (listId, taskId) =>
      apiRequest(`/tasks/lists/${listId}/tasks/${taskId}`, {
        method: "DELETE",
      }),
    getUserStats: () => apiRequest("/tasks/stats"),
    getLeaderboard: (limit = 10) =>
      apiRequest(`/tasks/leaderboard?limit=${limit}`),
  },

  // User Profile
  user: {
    getProfile: () => apiRequest("/user/profile"),
    updateProfile: (data) =>
      apiRequest("/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    // Upload profile photo - returns { url, name, type, size }
    uploadProfilePhoto: (file) => uploadRequest("/upload", file, "file"),
  },

  // File Upload
  upload: {
    // Generic file upload
    uploadFile: (file) => uploadRequest("/upload", file, "file"),
  },

  // Analytics Dashboard
  analytics: {
    // Get comprehensive dashboard data
    getDashboard: (startDate, endDate) =>
      apiRequest(
        `/analytics/dashboard?startDate=${startDate}&endDate=${endDate}`,
      ),

    // Weight tracking
    logWeight: (data) =>
      apiRequest("/analytics/weight", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getWeightHistory: (startDate, endDate) =>
      apiRequest(`/analytics/weight?startDate=${startDate}&endDate=${endDate}`),
    getLatestWeight: () => apiRequest("/analytics/weight/latest"),

    // Mood tracking
    logMood: (data) =>
      apiRequest("/analytics/mood", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMoodHistory: (startDate, endDate) =>
      apiRequest(`/analytics/mood?startDate=${startDate}&endDate=${endDate}`),
    getTodaysMood: () => apiRequest("/analytics/mood/today"),
  },
};

export default api;

// Export helper functions for use in auth context
export {
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  refreshAccessToken,
};
