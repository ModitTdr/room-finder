import React, { useEffect } from "react";
import { useState } from "react";
import { IoIosSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";


const DarkModeButton = () => {
  const [isDark,setIsDark] = useState(
    localStorage.getItem("darkMode") ? localStorage.getItem("darkMode"): false
  );

  const element = document.documentElement;
  React.useEffect(()=>{
    if(isDark){
      element.classList.add("dark");
      localStorage.setItem("darkMode",true);
    }else{
      element.classList.remove("dark");
      localStorage.setItem("darkMode",false);
    }
  })
  const iconBaseClass = "text-xl smooth-transition duration-150 absolute top-0 left-0";

  return (
    <div
      className="w-fit cursor-pointer relative border rounded-md p-1 h-fit"
      onClick={() => setIsDark(prev=>!prev) }
    >

      <div className="relative h-5 w-5"> 
        <IoIosSunny className={`${iconBaseClass} ${isDark ? "opacity-100" : "opacity-0"}`} />
        <IoMoon className={`${iconBaseClass} ${isDark ? "opacity-0" : "opacity-100"}`} />
      </div>
    </div>
  );
};

export default DarkModeButton;