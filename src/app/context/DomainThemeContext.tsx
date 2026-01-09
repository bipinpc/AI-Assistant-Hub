import { createContext, useContext, ReactNode } from 'react';
import { ColorTheme } from '../config/domains';
import { getTheme, ThemeName } from '../config/themes';

interface DomainThemeContextType {
  theme: ColorTheme;
  themeName: ThemeName;
  primaryColor: string;
}

const DomainThemeContext = createContext<DomainThemeContextType | undefined>(undefined);

interface DomainThemeProviderProps {
  children: ReactNode;
  themeName: ThemeName;
  primaryColor?: string;
}

/**
 * DomainThemeProvider - Provides centralized theme access to all components
 * 
 * This provider makes the domain's theme available throughout the component tree.
 * Components can access theme properties using the useDomainTheme() hook.
 * 
 * @example
 * ```tsx
 * <DomainThemeProvider themeName="blue-theme">
 *   <YourComponents />
 * </DomainThemeProvider>
 * ```
 */
export function DomainThemeProvider({ children, themeName, primaryColor }: DomainThemeProviderProps) {
  const theme = getTheme(themeName);
  
  return (
    <DomainThemeContext.Provider 
      value={{ 
        theme, 
        themeName,
        primaryColor: primaryColor || theme.primary
      }}
    >
      {children}
    </DomainThemeContext.Provider>
  );
}

/**
 * useDomainTheme - Hook to access the current domain's theme
 * 
 * Returns the active theme configuration including all color properties,
 * theme name, and primary color.
 * 
 * @throws Error if used outside of DomainThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, themeName, primaryColor } = useDomainTheme();
 *   
 *   return (
 *     <div className={theme.bg}>
 *       <h1 className={theme.text}>Hello</h1>
 *       <button className={theme.button}>Click me</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDomainTheme(): DomainThemeContextType {
  const context = useContext(DomainThemeContext);
  if (context === undefined) {
    throw new Error('useDomainTheme must be used within a DomainThemeProvider');
  }
  return context;
}

/**
 * Optional hook for components that might not have a domain theme
 * Returns undefined if used outside DomainThemeProvider instead of throwing
 */
export function useOptionalDomainTheme(): DomainThemeContextType | undefined {
  return useContext(DomainThemeContext);
}
