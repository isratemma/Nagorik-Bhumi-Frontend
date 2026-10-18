'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

// Safe localStorage read (returns null on SSR or error)
function readStorage(key) {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
}

export function UserProvider({ children }) {
  // Initialize directly from localStorage — no delay, no flash
  const [user, setUser] = useState(() => {
    const stored = readStorage('nb_user');
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });

  const [token, setToken] = useState(() => readStorage('nb_token'));

  // Re-sync if storage changes in another tab
  useEffect(() => {
    const handler = () => {
      try {
        const stored = readStorage('nb_user');
        setUser(stored ? JSON.parse(stored) : null);
        setToken(readStorage('nb_token'));
      } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('nb_user',  JSON.stringify(userData));
    localStorage.setItem('nb_token', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nb_user');
    localStorage.removeItem('nb_token');
    document.cookie = 'nb_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
