import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  timestamp: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin user is in localStorage
    const adminUserStr = localStorage.getItem('adminUser');
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        setUser(adminUser);
      } catch (e) {
        console.error('Failed to parse admin user:', e);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const isAdmin = user !== null;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
