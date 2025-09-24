import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Moon, Zap, Heart, Leaf, Sparkles, Star, Flame } from 'lucide-react';

interface MoodTheme {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradient: string;
  emotion: string;
}

const moodThemes: MoodTheme[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, business-focused experience',
    icon: <Star className="w-4 h-4" />,
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#06b6d4',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b'
    },
    gradient: 'from-blue-600 to-cyan-500',
    emotion: 'focused'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Vibrant and motivating colors',
    icon: <Zap className="w-4 h-4" />,
    colors: {
      primary: '#f59e0b',
      secondary: '#ea580c',
      accent: '#ef4444',
      background: '#fef3c7',
      surface: '#fffbeb',
      text: '#92400e',
      textSecondary: '#b45309'
    },
    gradient: 'from-orange-500 to-red-500',
    emotion: 'motivated'
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Peaceful and relaxing atmosphere',
    icon: <Leaf className="w-4 h-4" />,
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#06b6d4',
      background: '#ecfdf5',
      surface: '#f0fdf4',
      text: '#065f46',
      textSecondary: '#047857'
    },
    gradient: 'from-emerald-500 to-teal-500',
    emotion: 'relaxed'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Inspiring and artistic vibes',
    icon: <Sparkles className="w-4 h-4" />,
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#ec4899',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87',
      textSecondary: '#6b21a8'
    },
    gradient: 'from-purple-500 to-pink-500',
    emotion: 'inspired'
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy and welcoming feeling',
    icon: <Heart className="w-4 h-4" />,
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#f59e0b',
      background: '#fef2f2',
      surface: '#fef7f7',
      text: '#7f1d1d',
      textSecondary: '#991b1b'
    },
    gradient: 'from-red-500 to-orange-400',
    emotion: 'comfortable'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Elegant dark mode experience',
    icon: <Moon className="w-4 h-4" />,
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1'
    },
    gradient: 'from-indigo-500 to-cyan-400',
    emotion: 'sophisticated'
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    description: 'Fresh morning energy',
    icon: <Sun className="w-4 h-4" />,
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#fffbeb',
      surface: '#fef3c7',
      text: '#92400e',
      textSecondary: '#a16207'
    },
    gradient: 'from-yellow-400 to-orange-500',
    emotion: 'optimistic'
  },
  {
    id: 'passion',
    name: 'Passion',
    description: 'Bold and intense atmosphere',
    icon: <Flame className="w-4 h-4" />,
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#f59e0b',
      background: '#7f1d1d',
      surface: '#991b1b',
      text: '#fef2f2',
      textSecondary: '#fca5a5'
    },
    gradient: 'from-red-600 to-orange-600',
    emotion: 'intense'
  }
];

interface MoodThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MoodThemeSelector({ currentTheme, onThemeChange, isOpen, onClose }: MoodThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange(themeId);
  };

  const handleThemePreview = (themeId: string | null) => {
    setPreviewTheme(themeId);
    if (themeId) {
      // Apply preview theme temporarily
      applyThemeColors(moodThemes.find(t => t.id === themeId)!);
    } else {
      // Restore selected theme
      applyThemeColors(moodThemes.find(t => t.id === selectedTheme)!);
    }
  };

  const applyThemeColors = (theme: MoodTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', theme.colors.primary);
    root.style.setProperty('--mood-secondary', theme.colors.secondary);
    root.style.setProperty('--mood-accent', theme.colors.accent);
    root.style.setProperty('--mood-background', theme.colors.background);
    root.style.setProperty('--mood-surface', theme.colors.surface);
    root.style.setProperty('--mood-text', theme.colors.text);
    root.style.setProperty('--mood-text-secondary', theme.colors.textSecondary);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mood-Based Themes</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose a theme that matches your current mood</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            data-testid="button-close-theme-selector"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moodThemes.map((theme) => (
              <Card 
                key={theme.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                  selectedTheme === theme.id 
                    ? 'border-purple-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
                onMouseEnter={() => handleThemePreview(theme.id)}
                onMouseLeave={() => handleThemePreview(null)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      {theme.icon}
                      {theme.name}
                    </div>
                    {selectedTheme === theme.id && (
                      <Badge className="bg-purple-500 text-white">Active</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {theme.description}
                  </p>
                  
                  {/* Color Preview */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Color Palette</div>
                    <div className="grid grid-cols-4 gap-1">
                      <div 
                        className="h-6 w-full rounded"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary"
                      ></div>
                      <div 
                        className="h-6 w-full rounded"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary"
                      ></div>
                      <div 
                        className="h-6 w-full rounded"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent"
                      ></div>
                      <div 
                        className="h-6 w-full rounded border"
                        style={{ backgroundColor: theme.colors.surface }}
                        title="Surface"
                      ></div>
                    </div>
                  </div>
                  
                  {/* Gradient Preview */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Gradient Style</div>
                    <div className={`h-8 rounded bg-gradient-to-r ${theme.gradient}`}></div>
                  </div>
                  
                  {/* Emotion Badge */}
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="text-xs">
                      Feeling: {theme.emotion}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Hover over themes to preview them instantly. Your selected theme will be saved automatically.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export themes for use in other components
export { moodThemes };
export type { MoodTheme };