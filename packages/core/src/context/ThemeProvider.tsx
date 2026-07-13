import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { I18nProvider } from 'react-aria';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  /** BCP 47 locale for `I18nProvider` (number and date fields). Defaults to `en-US` on the server and `navigator.language` in the browser. */
  locale?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  locale: localeProp,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedLocale =
    localeProp ??
    (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme: handleSetTheme }),
    [theme, resolvedTheme, handleSetTheme],
  );

  return (
    <I18nProvider locale={resolvedLocale}>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </I18nProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
