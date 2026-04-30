'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔒 Future: Check for auth token/session
        const token = localStorage.getItem('sadena-auth-token');
        if (token) {
          // 🔒 Future: Validate token with API
          // For now, simulate logged in user
          setUser({ id: 'user-123', email: 'user@example.com' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 🔒 Future: Call login API
      console.log('TODO: Login API call', { email, password });

      // Simulate successful login
      const userData = { id: 'user-123', email };
      localStorage.setItem('sadena-auth-token', 'fake-token');
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // 🔒 Future: Call logout API
      console.log('TODO: Logout API call');

      localStorage.removeItem('sadena-auth-token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
