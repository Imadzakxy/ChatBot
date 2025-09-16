// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Les noms doivent correspondre exactement aux classes CSS que tu as défini dans ton fichier CSS global.
const availableThemes = [
  "theme-default",
  "theme-blue",
  "theme-golden",
  "theme-dark",
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    // Si saved est dans availableThemes, on le réutilise, sinon on part sur "theme-default"
    return availableThemes.includes(saved) ? saved : "theme-default";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // 1) On retire l’éventuelle classe de thème précédente
    availableThemes.forEach((t) => {
      if (root.classList.contains(t)) {
        root.classList.remove(t);
      }
    });

    // 2) On ajoute la nouvelle classe
    root.classList.add(theme);

    // 3) On stocke en localStorage pour persistance
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (availableThemes.includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.warn(`Theme "${newTheme}" n'est pas défini.`);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}