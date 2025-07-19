import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const currentMode = localStorage.getItem("theme");
    return currentMode ? currentMode === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const element = document.documentElement;
  useEffect(() => {
    element.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode])
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
