// DarkModeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  const toggleDarkMode = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  // Avoid rendering the button until the theme has been determined
  if (isDarkMode === null) return null;

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full w-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center transition-all duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <Sun className="text-yellow-500 w-5 h-5" />
      ) : (
        <Moon className="text-gray-800 w-5 h-5" />
      )}
    </button>
  );
}
