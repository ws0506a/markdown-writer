import { useCallback, useEffect, useState } from 'react';
import { readKey, writeKey } from '../lib/storage';

export type Theme = 'light' | 'dark';

const KEY = 'theme';

function getInitial(): Theme {
  const stored = readKey<Theme | null>(KEY, null);
  if (stored === 'light' || stored === 'dark') return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeKey(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
