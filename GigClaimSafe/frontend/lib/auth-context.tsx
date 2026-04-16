'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, getAuthToken, setAuthToken, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (error) {
        setAuthToken(null);
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    setAuthToken(response.access_token);
    setUser(response.user);
  };

  const register = async (userData: any) => {
    const response = await api.register(userData);
    setAuthToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}