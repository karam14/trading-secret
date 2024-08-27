"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // Import Moon and Sun icons

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <Sun className="text-yellow-500 w-5 h-5" /> // Sun icon for dark mode
      ) : (
        <Moon className="text-gray-800 dark:text-gray-200 w-5 h-5" /> // Moon icon for light mode
      )}
    </button>
  );
};
