'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const restore = useCallback(() => {
    const stored = localStorage.getItem('admin_data');
    const token = localStorage.getItem('admin_token');
    if (stored && token) setAdmin(JSON.parse(stored));
    setLoading(false);
  }, []);

  useEffect(() => { restore(); }, [restore]);

  const login = async (email: string, password: string) => {
    const { data } = await adminApi.post('/auth/admin/login', { email, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_data', JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
