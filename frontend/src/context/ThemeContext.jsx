import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const THEME_STORAGE_KEY = 'nexus-theme';

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* private mode / storage disabled — fall through to the system preference */
  }
  return null;
};

const systemTheme = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const ThemeContext = createContext({ theme: 'light', setTheme: () => {}, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  // index.html stamps data-theme before first paint; trust it so React's
  // first render agrees with what's already on screen.
  const [theme, setThemeState] = useState(
    () => document.documentElement.getAttribute('data-theme') || readStoredTheme() || systemTheme()
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* preference just won't persist */
    }
  }, [theme]);

  // Follow the OS only while the user hasn't picked a theme themselves.
  useEffect(() => {
    if (readStoredTheme()) return undefined;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const onChange = (e) => setThemeState(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Stamp the attribute synchronously, before React re-renders. Consumers
  // that read resolved token values during render (the Chart.js canvas)
  // would otherwise pick up the outgoing theme's colours.
  const setTheme = useCallback((next) => {
    const resolved = next === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    setThemeState(resolved);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
