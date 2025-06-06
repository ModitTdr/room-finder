import { Link } from "react-router";

import DarkModeButton from "./DarkModeButton";
import Button from "../common/Button";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center container p-4 sm:8">
        <div>test</div>
        <div className="flex items-center justify-between">
          <input 
              type="text" 
              placeholder="Search"
              className="border border-black/30 rounded-xl px-2 py-1 transition duration-200 ease-in-out focus:border-black focus:border-opacity-100 focus:outline-none"
          />
          <DarkModeButton />
          <Link to="/login">
            <Button name="Login"/>
          </Link>
          <Link to="/register">
            <Button name="Sign Up"/>
          </Link>
        </div>
    </div>
  )
}

export default Navbar;