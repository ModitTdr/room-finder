import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
   const [isDark, setIsDark] = useState(() => {
       const currentMode = localStorage.getItem("darkMode");
       return currentMode === "true";
     }
   );
   const element = document.documentElement;
   useEffect(() => {
      if (isDark) {
         element.classList.add("dark");
         localStorage.setItem("darkMode", "true");
      } else {
         element.classList.remove("dark");
         localStorage.setItem("darkMode", "false");
      }
   },[isDark]);
   const toggleDarkMode = () => {
      setIsDark(prev => !prev);
   };
   return(
      <ThemeContext.Provider value= {{isDark, toggleDarkMode}}>
         {children}
      </ThemeContext.Provider>
   )
}