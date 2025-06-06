import React from "react";
import { useState } from "react";
import { IoIosSunny } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";

const DarkModeButton = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") ? localStorage.getItem("darkMode"): false
  );

  const element = document.documentElement;
  React.useEffect(()=>{
    if(darkMode){
      element.classList.add("dark");
      localStorage.setItem("darkMode",true);
    }else{
      element.classList.remove("dark");
      localStorage.setItem("darkMode",false);
    }
  })
  const iconBaseClass = "text-xl transition-all ease-in-out duration-150 absolute top-0 left-0";

  return (
    <div
      className="w-fit cursor-pointer relative"
      onClick={() => setDarkMode(prevMode => !prevMode)}
    >
      <div className="relative h-5 w-5"> 
        <IoIosSunny className={`${iconBaseClass} ${darkMode ? "opacity-100" : "opacity-0"}`} />
        <IoMoonOutline className={`${iconBaseClass} ${darkMode ? "opacity-0" : "opacity-100"}`} />
      </div>
    </div>
  );
};

export default DarkModeButton;