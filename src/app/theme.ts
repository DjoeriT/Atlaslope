import { useEffect, useState } from 'react';

export type Theme = 'paper' | 'dark';
const KEY = 'atlaslope-theme';

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'paper' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

const systemTheme = (): Theme => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'paper');

/** The theme follows the system until the person picks one; the pick is remembered. index.html sets the first value before paint. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => stored() ?? systemTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (!stored()) setTheme(systemTheme()); };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'paper' : 'dark';
    setTheme(next);
    try { localStorage.setItem(KEY, next); } catch { /* storage blocked: the pick lasts for this visit */ }
  };
  return [theme, toggle];
}
