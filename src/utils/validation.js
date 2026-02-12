/**
 * Validation Utilities
 * Centralized validation functions for forms and user input
 */

import { AUTH, REGEX, ERROR_MESSAGES, NUTRITION, TASKS, CHAT } from './constants';
import { ValidationError } from './errorHandler';

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (email.length > AUTH.EMAIL_MAX_LENGTH) {
    return `Email must be less than ${AUTH.EMAIL_MAX_LENGTH} characters.`;
  }

  if (!REGEX.EMAIL.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }

  return null;
};

/**
 * Validate password
 */
export const validatePassword = (password, options = {}) => {
  const {
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false,
  } = options;

  if (!password) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters long.`;
  }

  if (password.length > AUTH.PASSWORD_MAX_LENGTH) {
    return `Password must be less than ${AUTH.PASSWORD_MAX_LENGTH} characters.`;
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }

  if (requireNumber && !/\d/.test(password)) {
    return 'Password must contain at least one number.';
  }

  if (requireSpecialChar && !/[@$!%*?&]/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&).';
  }

  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
  }

  return null;
};

/**
 * Validate full name
 */
export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (name.length > AUTH.NAME_MAX_LENGTH) {
    return `Name must be less than ${AUTH.NAME_MAX_LENGTH} characters.`;
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }

  return null;
};

/**
 * Validate login form
 */
export const validateLoginForm = (email, password) => {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate signup form
 */
export const validateSignupForm = (formData) => {
  const { email, password, confirmPassword, fullName, agreeToTerms } = formData;
  const errors = {};

  // Validate email
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  // Validate full name
  const nameError = validateFullName(fullName);
  if (nameError) errors.fullName = nameError;

  // Validate password
  const passwordError = validatePassword(password, {
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
  });
  if (passwordError) errors.password = passwordError;

  // Validate password confirmation
  const confirmError = validatePasswordConfirmation(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  // Validate terms agreement
  if (!agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate meal input
 */
export const validateMeal = (mealType, mealName) => {
  const errors = {};

  if (!mealType || !Object.values(NUTRITION.MEAL_TYPES).includes(mealType)) {
    errors.mealType = 'Please select a valid meal type.';
  }

  if (!mealName || !mealName.trim()) {
    errors.mealName = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (mealName && mealName.length > 200) {
    errors.mealName = 'Meal name must be less than 200 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate nutrition goal
 */
export const validateNutritionGoal = (calories, protein, carbs, fats) => {
  const errors = {};

  if (!calories || calories <= 0) {
    errors.calories = 'Calorie goal must be greater than 0.';
  }

  if (calories > 10000) {
    errors.calories = 'Calorie goal seems too high. Please enter a realistic value.';
  }

  if (protein < 0 || carbs < 0 || fats < 0) {
    errors.macros = 'Macro values cannot be negative.';
  }

  if (protein > 500 || carbs > 1000 || fats > 500) {
    errors.macros = 'Macro values seem too high. Please enter realistic values.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate task input
 */
export const validateTask = (text, priority) => {
  const errors = {};

  if (!text || !text.trim()) {
    errors.text = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (text && text.length > TASKS.MAX_TASK_LENGTH) {
    errors.text = `Task must be less than ${TASKS.MAX_TASK_LENGTH} characters.`;
  }

  if (!priority || !Object.values(TASKS.PRIORITY_LEVELS).includes(priority)) {
    errors.priority = 'Please select a valid priority level.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate task list name
 */
export const validateTaskListName = (name) => {
  if (!name || !name.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (name.length > TASKS.MAX_LIST_NAME_LENGTH) {
    return `List name must be less than ${TASKS.MAX_LIST_NAME_LENGTH} characters.`;
  }

  return null;
};

/**
 * Validate chat message
 */
export const validateChatMessage = (text, attachment) => {
  const errors = {};

  if (!text?.trim() && !attachment) {
    errors.message = 'Please enter a message or attach a file.';
  }

  if (text && text.length > CHAT.MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be less than ${CHAT.MAX_MESSAGE_LENGTH} characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file) => {
  if (!file) {
    return 'No file selected.';
  }

  if (file.size > CHAT.MAX_FILE_SIZE) {
    const maxSizeMB = CHAT.MAX_FILE_SIZE / (1024 * 1024);
    return `File size must be less than ${maxSizeMB}MB.`;
  }

  if (!CHAT.ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'File type not supported. Please upload an image or PDF.';
  }

  return null;
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!REGEX.URL.test(url)) {
    return 'Please enter a valid URL.';
  }

  return null;
};

/**
 * Validate number range
 */
export const validateNumberRange = (value, min, max, fieldName = 'Value') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required.`;
  }

  const num = Number(value);

  if (isNaN(num)) {
    return `${fieldName} must be a number.`;
  }

  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}.`;
  }

  return null;
};

/**
 * Validate date
 */
export const validateDate = (date, options = {}) => {
  const { allowPast = true, allowFuture = true, required = true } = options;

  if (!date) {
    return required ? 'Date is required.' : null;
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date format.';
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  if (!allowPast && dateObj < now) {
    return 'Date cannot be in the past.';
  }

  if (!allowFuture && dateObj > now) {
    return 'Date cannot be in the future.';
  }

  return null;
};

/**
 * Sanitize string input (remove HTML tags, trim whitespace)
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  
  // Remove HTML tags
  const stripped = str.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  return stripped.trim();
};

/**
 * Validate and sanitize form data
 */
export const validateAndSanitize = (data, validationRules) => {
  const errors = {};
  const sanitized = {};

  Object.keys(validationRules).forEach((field) => {
    const value = data[field];
    const rules = validationRules[field];

    // Sanitize string values
    const sanitizedValue = typeof value === 'string' ? sanitizeString(value) : value;
    sanitized[field] = sanitizedValue;

    // Run validation
    if (typeof rules === 'function') {
      const error = rules(sanitizedValue);
      if (error) errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitized,
  };
};

/**
 * Throw validation error if validation fails
 */
export const validateOrThrow = (validationResult) => {
  if (!validationResult.isValid) {
    throw new ValidationError(
      'Validation failed',
      null,
      validationResult.errors
    );
  }
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateFullName,
  validateLoginForm,
  validateSignupForm,
  validateMeal,
  validateNutritionGoal,
  validateTask,
  validateTaskListName,
  validateChatMessage,
  validateFileUpload,
  validateUrl,
  validateNumberRange,
  validateDate,
  sanitizeString,
  validateAndSanitize,
  validateOrThrow,
};

