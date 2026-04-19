import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buildSession, fetchIpLocation, loadStoredSession, saveSession, UserSession } from '@/src/lib/session';

interface SessionContextValue {
  session: UserSession | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const stored = loadStoredSession();
      const current = await fetchIpLocation();
      const currentLabel = `${current.city}, ${current.region}, ${current.country}`.replace(/(^[\s,]+|[\s,]+$)/g, '');

      if (
        stored &&
        stored.ipAddress === current.ipAddress &&
        stored.city === current.city &&
        stored.region === current.region &&
        stored.country === current.country
      ) {
        const updated = { ...stored, lastSeenAt: new Date().toISOString() };
        saveSession(updated);
        setSession(updated);
      } else {
        const newSession = buildSession(current);
        saveSession(newSession);
        setSession(newSession);
      }
    } catch (fetchError) {
      const stored = loadStoredSession();
      if (stored) {
        setSession(stored);
      } else {
        const fallbackSession = buildSession({ ipAddress: 'unknown', city: '', region: '', country: '' });
        saveSession(fallbackSession);
        setSession(fallbackSession);
      }
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const refreshSession = useMemo(() => async () => {
    await loadSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, error, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within a SessionProvider');
  return context;
};
