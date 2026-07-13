import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia; components read it for theme and
// prefers-reduced-motion checks (ThemeProvider, useMediaQuery, Toast).
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
