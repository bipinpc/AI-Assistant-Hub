import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return 'light';
    }
    
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      console.log('ThemeProvider initializing with savedTheme:', savedTheme);
      
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
    }
    
    return 'light';
  });

  useEffect(() => {
    console.log('Theme changed to:', theme);
    
    // Update document class and localStorage
    const root = window.document.documentElement;
    
    try {
      // Remove both classes first
      root.classList.remove('light', 'dark');
      
      // Add the current theme class
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      console.log('Applied theme class:', theme, 'HTML classes:', root.classList.toString());
      console.log('localStorage updated:', localStorage.getItem('theme'));
      
      // Force a repaint
      requestAnimationFrame(() => {
        void root.offsetHeight;
      });
    } catch (e) {
      console.error('Error applying theme:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log('toggleTheme called, current theme:', theme);
    setThemeState((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('Toggling from', prev, 'to', newTheme);
      return newTheme;
    });
  };

  const setTheme = (newTheme: Theme) => {
    console.log('setTheme called with:', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}