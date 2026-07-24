import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  // Initialize Auth State on app mount / refresh
  const initAuth = useCallback(async () => {
    const savedToken = storage.getToken();
    if (savedToken) {
      try {
        const currentUser = await authService.getMe();
        const userData = {
          id: currentUser.id,
          admin_name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          company_id: currentUser.company_id,
          company_name: currentUser.company_name || 'HireMind Client',
        };
        setUser(userData);
        storage.setUser(userData);
      } catch (err) {
        console.error('Session initialization error:', err);
        // Clear invalid token
        storage.clearAuth();
        setUser(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      const accessToken = authData.access_token;

      // Save token in storage
      storage.setToken(accessToken);
      setToken(accessToken);

      // Fetch User Details
      const currentUser = await authService.getMe();
      const userData = {
        id: currentUser.id,
        admin_name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        company_id: currentUser.company_id,
        company_name: currentUser.company_name || 'HireMind Client',
      };

      setUser(userData);
      storage.setUser(userData);
      return userData;
    } catch (error) {
      storage.clearAuth();
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (companyData) => {
    setIsLoading(true);
    try {
      // 1. Call Register API
      await authService.register(companyData);

      // 2. Automatically log in after registration
      return await login({
        email: companyData.email,
        password: companyData.password,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    storage.clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        setIsLoading,
        login,
        register,
        logout,
        refreshUser: initAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
