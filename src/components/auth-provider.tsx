"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage / cookies on mount
    let token = getCookie('token') as string | undefined;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token') || undefined;
    }
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // If token is expired, logout
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else if (decoded.id || decoded._id) {
             setUser({
               id: decoded.id || decoded._id,
               email: decoded.email || '',
               role: decoded.role || 'USER',
               name: decoded.name || 'User'
             });
          }
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setCookie('token', token, { maxAge: 60 * 60 * 24 * 7, path: '/' }); // 7 days
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    deleteCookie('token', { path: '/' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
