import { ColorTheme } from './domains';

/**
 * Centralized Theme Registry
 * 
 * This file contains all available themes that can be assigned to domains.
 * To add a new theme:
 * 1. Define the theme object following the ColorTheme interface
 * 2. Add it to the themes object with a unique key
 * 3. Use the key in domain configuration (e.g., theme: 'blue-theme')
 * 
 * Theme naming convention: "{color}-theme"
 */

export const themes = {
  'blue-theme': {
    primary: '#4169E1',
    secondary: '#5B7FE8',
    text: 'text-blue-600',
    textDark: 'text-blue-400',
    bg: 'bg-blue-50',
    bgDark: 'bg-blue-500/20',
    bgHover: 'hover:bg-blue-100',
    bgHoverDark: 'dark:hover:bg-blue-500/30',
    border: 'border-blue-200',
    borderDark: 'dark:border-blue-500/30',
    accent: 'text-blue-500',
    accentDark: 'text-blue-400',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    gradientDark: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    iconBg: 'bg-blue-50',
    iconBgDark: 'dark:bg-blue-600/20',
    button: 'bg-blue-600',
    buttonHover: 'hover:bg-blue-700',
  } as ColorTheme,

  'green-theme': {
    primary: '#10b981',
    secondary: '#14b8a6',
    text: 'text-green-600',
    textDark: 'text-green-400',
    bg: 'bg-green-50',
    bgDark: 'bg-green-500/20',
    bgHover: 'hover:bg-green-100',
    bgHoverDark: 'dark:hover:bg-green-500/30',
    border: 'border-green-200',
    borderDark: 'dark:border-green-500/30',
    accent: 'text-green-500',
    accentDark: 'text-green-400',
    gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
    gradientDark: 'bg-gradient-to-r from-green-400 to-emerald-500',
    iconBg: 'bg-green-50',
    iconBgDark: 'dark:bg-green-600/20',
    button: 'bg-green-600',
    buttonHover: 'hover:bg-green-700',
  } as ColorTheme,

  'purple-theme': {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    text: 'text-purple-600',
    textDark: 'text-purple-400',
    bg: 'bg-purple-50',
    bgDark: 'bg-purple-500/20',
    bgHover: 'hover:bg-purple-100',
    bgHoverDark: 'dark:hover:bg-purple-500/30',
    border: 'border-purple-200',
    borderDark: 'dark:border-purple-500/30',
    accent: 'text-purple-500',
    accentDark: 'text-purple-400',
    gradient: 'bg-gradient-to-r from-purple-500 to-violet-600',
    gradientDark: 'bg-gradient-to-r from-purple-400 to-violet-500',
    iconBg: 'bg-purple-50',
    iconBgDark: 'dark:bg-purple-600/20',
    button: 'bg-purple-600',
    buttonHover: 'hover:bg-purple-700',
  } as ColorTheme,

  'red-theme': {
    primary: '#ef4444',
    secondary: '#f87171',
    text: 'text-red-600',
    textDark: 'text-red-400',
    bg: 'bg-red-50',
    bgDark: 'bg-red-500/20',
    bgHover: 'hover:bg-red-100',
    bgHoverDark: 'dark:hover:bg-red-500/30',
    border: 'border-red-200',
    borderDark: 'dark:border-red-500/30',
    accent: 'text-red-500',
    accentDark: 'text-red-400',
    gradient: 'bg-gradient-to-r from-red-500 to-rose-600',
    gradientDark: 'bg-gradient-to-r from-red-400 to-rose-500',
    iconBg: 'bg-red-50',
    iconBgDark: 'dark:bg-red-600/20',
    button: 'bg-red-600',
    buttonHover: 'hover:bg-red-700',
  } as ColorTheme,

  // Additional themes can be added here following the same pattern
  // Example:
  // 'orange-theme': { ... },
  // 'teal-theme': { ... },
  // 'pink-theme': { ... },
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Get a theme by name
 * @param themeName - The theme name (e.g., 'blue-theme')
 * @returns The ColorTheme object
 */
export function getTheme(themeName: ThemeName): ColorTheme {
  return themes[themeName];
}

/**
 * Check if a theme exists
 * @param themeName - The theme name to check
 * @returns true if the theme exists
 */
export function themeExists(themeName: string): themeName is ThemeName {
  return themeName in themes;
}

/**
 * Get all available theme names
 * @returns Array of theme names
 */
export function getAllThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}
