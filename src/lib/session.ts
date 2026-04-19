export interface UserSession {
  sessionId: string;
  ipAddress: string;
  city: string;
  region: string;
  country: string;
  locationLabel: string;
  createdAt: string;
  lastSeenAt: string;
}

const STORAGE_KEY = 'house_of_lighting_session_v1';

function createRandomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `sess-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function formatLocation(city: string, region: string, country: string) {
  const parts = [city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown location';
}

export function loadStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserSession) : null;
  } catch (error) {
    console.warn('Failed to read stored session:', error);
    return null;
  }
}

export function saveSession(session: UserSession) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to save session:', error);
  }
}

export function buildSession(data: {
  ipAddress: string;
  city: string;
  region: string;
  country: string;
}): UserSession {
  const locationLabel = formatLocation(data.city, data.region, data.country);

  return {
    sessionId: createRandomId(),
    ipAddress: data.ipAddress,
    city: data.city,
    region: data.region,
    country: data.country,
    locationLabel,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };
}

export async function fetchIpLocation() {
  return {
    ipAddress: 'local-session',
    city: '',
    region: '',
    country: '',
  };
}
