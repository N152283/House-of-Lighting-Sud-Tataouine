import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Session } from '@supabase/supabase-js';

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
  signIn: (email: string, password: string) => Promise<AdminUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LEGACY_ADMIN_KEY = 'adminUser';
const LEGACY_ADMIN_EMAIL = 'admin@houseoflight.tn';
const LEGACY_ADMIN_PASSWORD = 'Admin123';

const adminFromSession = (session: Session | null): AdminUser | null => {
  const sessionUser = session?.user;
  if (!sessionUser?.email) return null;

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    role: 'admin',
    timestamp: new Date().toISOString(),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const authUser = adminFromSession(data.session);
      if (authUser) {
        setUser(authUser);
      } else {
        const legacyUser = localStorage.getItem(LEGACY_ADMIN_KEY);
        setUser(legacyUser ? JSON.parse(legacyUser) : null);
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(adminFromSession(session));
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Compatibility path for the existing custom users-table admin login.
      // Remove this after FIX_ADMIN_AUTH.sql is run and the Auth login is confirmed.
      if (email.trim().toLowerCase() !== LEGACY_ADMIN_EMAIL || password !== LEGACY_ADMIN_PASSWORD) {
        throw error;
      }

      const { data: users, error: legacyError } = await supabase
        .from('users')
        .select('id,email,role')
        .eq('email', LEGACY_ADMIN_EMAIL)
        .eq('role', 'admin')
        .limit(1);

      if (legacyError || !users?.[0]) throw error;

      const legacyAdminUser = {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(LEGACY_ADMIN_KEY, JSON.stringify(legacyAdminUser));
      setUser(legacyAdminUser);
      return legacyAdminUser;
    }

    const adminUser = adminFromSession(data.session);
    if (!adminUser) throw new Error('Session admin introuvable.');

    localStorage.removeItem(LEGACY_ADMIN_KEY);
    setUser(adminUser);
    return adminUser;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(LEGACY_ADMIN_KEY);
    setUser(null);
  };

  const isAdmin = user !== null;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
