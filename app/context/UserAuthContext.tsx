'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  gender: string | null;
  id_number: string | null;
  status: string;
}

interface UserAuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithOtp: (phone: string, code: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('user_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/user/me');
      setUser(data);
    } catch {
      localStorage.removeItem('user_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const loginWithEmail = async (email: string, password: string) => {
    const { data } = await api.post('/auth/user/login', { email, password });
    localStorage.setItem('user_token', data.token);
    setUser(data.user);
  };

  const sendOtp = async (phone: string) => {
    await api.post('/auth/user/otp/send', { phone });
  };

  const loginWithOtp = async (phone: string, code: string) => {
    const { data } = await api.post('/auth/user/otp/verify', { phone, code });
    localStorage.setItem('user_token', data.token);
    setUser(data.user);
  };

  const register = async (formData: { name: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/user/register', formData);
    localStorage.setItem('user_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, loginWithEmail, loginWithOtp, sendOtp, register, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
  return ctx;
}
