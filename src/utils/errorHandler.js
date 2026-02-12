/**
 * Error Handling Utilities
 * Centralized error handling for consistent error management
 */

import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isApiError = true;
  }
}

/**
 * Custom Network Error class
 */
export class NetworkError extends Error {
  constructor(message = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message);
    this.name = 'NetworkError';
    this.isNetworkError = true;
  }
}

/**
 * Custom Validation Error class
 */
export class ValidationError extends Error {
  constructor(message, field = null, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.errors = errors;
    this.isValidationError = true;
  }
}

/**
 * Parse error response from API
 */
export const parseApiError = (error) => {
  // Network error (no response)
  if (!error.response) {
    return new NetworkError(ERROR_MESSAGES.NETWORK_ERROR);
  }

  const { status, data } = error.response;
  
  // Extract error message
  const message = data?.message || data?.error || getDefaultErrorMessage(status);
  const code = data?.code || null;
  const details = data?.details || null;

  return new ApiError(message, status, code, details);
};

/**
 * Get default error message based on status code
 */
export const getDefaultErrorMessage = (statusCode) => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Invalid request. Please check your input.';
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return 'You do not have permission to perform this action.';
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.CONFLICT:
      return 'This resource already exists.';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return 'Unable to process your request. Please check your input.';
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return 'Too many requests. Please try again later.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }
};

/**
 * Check if error is a specific type
 */
export const isApiError = (error) => error?.isApiError === true;
export const isNetworkError = (error) => error?.isNetworkError === true;
export const isValidationError = (error) => error?.isValidationError === true;

/**
 * Check if error is authentication related
 */
export const isAuthError = (error) => {
  if (!isApiError(error)) return false;
  return error.statusCode === HTTP_STATUS.UNAUTHORIZED || 
         error.statusCode === HTTP_STATUS.FORBIDDEN;
};

/**
 * Handle error and return user-friendly message
 */
export const handleError = (error, customMessages = {}) => {
  // Custom error message for specific error codes
  if (error?.code && customMessages[error.code]) {
    return customMessages[error.code];
  }

  // Network error
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Validation error
  if (isValidationError(error)) {
    return error.message;
  }

  // API error
  if (isApiError(error)) {
    return error.message;
  }

  // Timeout error
  if (error?.message === 'Request timeout') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  // Generic error
  return error?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
};

/**
 * Log error (can be extended to send to error tracking service)
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    name: error?.name || 'Error',
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error logged:', errorInfo);
  }

  // TODO: Send to error tracking service (Sentry, etc.) in production
  // if (import.meta.env.PROD && FEATURES.ERROR_REPORTING) {
  //   sendToErrorTrackingService(errorInfo);
  // }

  return errorInfo;
};

/**
 * Error boundary helper - formats error for display
 */
export const formatErrorForDisplay = (error) => {
  const userMessage = handleError(error);
  const showDetails = import.meta.env.DEV;

  return {
    title: 'An Error Occurred',
    message: userMessage,
    details: showDetails ? {
      error: error?.message,
      stack: error?.stack,
      code: error?.code,
      statusCode: error?.statusCode,
    } : null,
  };
};

/**
 * Retry helper for failed requests
 */
export const retryRequest = async (
  requestFn,
  maxRetries = 3,
  delay = 1000,
  onRetry = null
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) except 429
      if (isApiError(error) && 
          error.statusCode >= 400 && 
          error.statusCode < 500 &&
          error.statusCode !== HTTP_STATUS.TOO_MANY_REQUESTS) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Call onRetry callback
      if (onRetry) {
        onRetry(attempt + 1, maxRetries);
      }

      // Wait before retry with exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, attempt))
      );
    }
  }

  throw lastError;
};

/**
 * Async error wrapper for try-catch
 * Returns [error, data] tuple
 */
export const asyncHandler = async (promise) => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    logError(error);
    return [error, null];
  }
};

/**
 * Create error response object
 */
export const createErrorResponse = (message, code = null, details = null) => {
  return {
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Extract validation errors from API response
 */
export const extractValidationErrors = (error) => {
  if (!isApiError(error) || error.statusCode !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    return {};
  }

  const errors = error.details?.errors || error.details || {};
  
  // Convert array of errors to object keyed by field
  if (Array.isArray(errors)) {
    return errors.reduce((acc, err) => {
      if (err.field) {
        acc[err.field] = err.message;
      }
      return acc;
    }, {});
  }

  return errors;
};

export default {
  ApiError,
  NetworkError,
  ValidationError,
  parseApiError,
  handleError,
  logError,
  formatErrorForDisplay,
  isApiError,
  isNetworkError,
  isValidationError,
  isAuthError,
  retryRequest,
  asyncHandler,
  createErrorResponse,
  extractValidationErrors,
};

