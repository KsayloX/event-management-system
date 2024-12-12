import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { useThemeStore } from '../../store/themeStore';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}