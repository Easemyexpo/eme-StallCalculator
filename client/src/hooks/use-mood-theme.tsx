import { useState, useEffect, useCallback } from 'react';
import { moodThemes } from '@/components/ui/mood-theme-selector';
import type { MoodTheme } from '@/components/ui/mood-theme-selector';

interface UseMoodThemeReturn {
  currentTheme: MoodTheme;
  setTheme: (themeId: string) => void;
  applyTheme: (theme: MoodTheme) => void;
  resetTheme: () => void;
  isThemeApplied: boolean;
}

const THEME_STORAGE_KEY = 'easemyexpo_mood_theme';
const DEFAULT_THEME_ID = 'professional';

export function useMoodTheme(): UseMoodThemeReturn {
  const [currentThemeId, setCurrentThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [isThemeApplied, setIsThemeApplied] = useState(false);

  // Get current theme object
  const currentTheme = moodThemes.find(theme => theme.id === currentThemeId) || moodThemes[0];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && moodThemes.some(theme => theme.id === savedTheme)) {
      setCurrentThemeId(savedTheme);
    }
  }, []);

  // Apply theme colors to CSS custom properties
  const applyTheme = useCallback((theme: MoodTheme) => {
    const root = document.documentElement;
    
    // Apply mood theme colors
    root.style.setProperty('--mood-primary', theme.colors.primary);
    root.style.setProperty('--mood-secondary', theme.colors.secondary);
    root.style.setProperty('--mood-accent', theme.colors.accent);
    root.style.setProperty('--mood-background', theme.colors.background);
    root.style.setProperty('--mood-surface', theme.colors.surface);
    root.style.setProperty('--mood-text', theme.colors.text);
    root.style.setProperty('--mood-text-secondary', theme.colors.textSecondary);
    
    // Apply to some common Tailwind classes by updating CSS variables
    root.style.setProperty('--tw-gradient-from', theme.colors.primary);
    root.style.setProperty('--tw-gradient-to', theme.colors.secondary);
    
    // Add body class for theme-specific styling
    document.body.className = document.body.className.replace(/mood-theme-\w+/g, '');
    document.body.classList.add(`mood-theme-${theme.id}`);
    
    setIsThemeApplied(true);
  }, []);

  // Set new theme
  const setTheme = useCallback((themeId: string) => {
    const theme = moodThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentThemeId(themeId);
      applyTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  }, [applyTheme]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME_ID);
  }, [setTheme]);

  // Auto-apply theme when currentThemeId changes
  useEffect(() => {
    if (currentTheme) {
      applyTheme(currentTheme);
    }
  }, [currentTheme, applyTheme]);

  return {
    currentTheme,
    setTheme,
    applyTheme,
    resetTheme,
    isThemeApplied
  };
}