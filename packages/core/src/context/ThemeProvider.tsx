import {
	createContext,
	useContext,
	useCallback,
	useMemo,
	useState,
	useEffect,
} from 'react';
import type { ReactNode } from 'react';

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
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
};

interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: Theme;
}

export const ThemeProvider = ({
	children,
	defaultTheme = 'system',
}: ThemeProviderProps) => {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

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
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
