import { createContext, useContext, useState, useEffect } from "react";
import api, {
  getAuthToken,
  setAuthTokens,
  clearAuthTokens,
} from "../services/api";
import { STORAGE_KEYS } from "../utils/constants";
import { isAuthError, logError } from "../utils/errorHandler";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();

        if (!token) {
          return;
        }

        const storedUser =
          sessionStorage.getItem(STORAGE_KEYS.USER_DATA) ||
          localStorage.getItem(STORAGE_KEYS.USER_DATA);
        const rememberMe = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }

        // Always try to sync the latest profile from the API when we have a token.
        const profile = await api.user.getProfile();
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
        }
      } catch (error) {
        logError(error, { context: "checkAuth" });

        if (isAuthError(error)) {
          clearAuthTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login user with tokens and user data
   * @param {Object} authResponse - Response from login API
   * @param {Object} authResponse.user - User data
   * @param {string} authResponse.accessToken - JWT access token
   * @param {string} authResponse.refreshToken - JWT refresh token
   * @param {boolean} rememberMe - Whether to persist session
   */
  const login = (authResponse, rememberMe = false) => {
    try {
      console.log('AuthContext login called with:', authResponse);
      
      // Check if authResponse exists
      if (!authResponse) {
        throw new Error('Auth response is undefined or null');
      }

      const { user: userData, accessToken, refreshToken } = authResponse;

      console.log('Extracted data:', { userData, accessToken: accessToken ? 'present' : 'missing', refreshToken: refreshToken ? 'present' : 'missing' });

      if (!accessToken || !userData) {
        throw new Error('Invalid authentication response - missing accessToken or user data');
      }

      // Store tokens
      setAuthTokens(accessToken, refreshToken, rememberMe);

      // Store user data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error details:', error);
      logError(error, { context: 'login', authResponse });
      throw error;
    }
  };

  /**
   * Logout user and clear all auth data
   */
  const logout = () => {
    try {
      // Clear tokens
      clearAuthTokens();

      // Update state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      logError(error, { context: 'logout' });
      // Still clear state even if error occurs
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user data
   * @param {Object} updatedData - Updated user fields
   */
  const updateUser = (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);

      // Update stored user data
      const storage = localStorage.getItem(STORAGE_KEYS.USER_DATA) 
        ? localStorage 
        : sessionStorage;
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUserData));
    } catch (error) {
      logError(error, { context: 'updateUser' });
      throw error;
    }
  };

  /**
   * Check if user has a valid token
   */
  const hasValidToken = () => {
    return !!getAuthToken();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    hasValidToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
