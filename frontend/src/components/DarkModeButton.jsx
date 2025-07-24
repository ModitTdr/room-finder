import { useContext } from "react";
import { IoIosSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import { ThemeContext } from "@/context/ThemeContext";


const DarkModeButton = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const iconBaseClass = "text-xl smooth-transition duration-150 absolute top-1/2 left-1/2 -translate-1/2";

  return (
    <div
      className="w-fit cursor-pointer relative border rounded-full p-1 h-fit text-neutral-300 border-neutral-600/70 bg-neutral-800/95 hover:text-accent"
      onClick={toggleDarkMode}
    >
      <div className="relative h-5 w-5 p-3">
        <IoIosSunny className={`${iconBaseClass} ${darkMode ? "opacity-100" : "opacity-0"}`} />
        <IoMoon className={`${iconBaseClass} ${darkMode ? "opacity-0" : "opacity-100"}`} />
      </div>
    </div>
  );
};

export default DarkModeButton;