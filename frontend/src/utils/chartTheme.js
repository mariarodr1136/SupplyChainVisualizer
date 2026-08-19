import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/* Chart.js draws to a canvas, so it can't consume `var(--token)` the way
   the DOM can. Resolve the design tokens to concrete values instead, and
   recompute them whenever the theme flips. */
export const readToken = (name, fallback = '') => {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

export const useChartTheme = () => {
  const { theme } = useTheme();

  return useMemo(() => {
    const tick = readToken('--text-secondary', '#787774');
    const grid = readToken('--border', 'rgba(55,53,47,0.09)');
    const surface = readToken('--bg-surface', '#ffffff');
    const accent = readToken('--accent', '#f65a24');

    return {
      theme,
      tick,
      grid,
      surface,
      accent,
      accentSoft: readToken('--accent-soft', 'rgba(246,90,36,0.12)'),
      series: (token, fallback) => readToken(token, fallback),
      tooltip: {
        backgroundColor: readToken('--bg-elevated', '#ffffff'),
        titleColor: readToken('--text-primary', '#37352f'),
        bodyColor: readToken('--text-secondary', '#787774'),
        borderColor: readToken('--border', 'rgba(55,53,47,0.09)'),
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        titleFont: { weight: '600', size: 12 },
        bodyFont: { size: 12 },
      },
    };
  }, [theme]);
};
