import { Link } from "react-router";

import DarkModeButton from "./DarkModeButton";
import { IoIosMenu, IoIosSearch } from "react-icons/io";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/features/auth/authSlice";

const NavLinks = (props) => {
  const linkStyle = "flex items-center gap-2"
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }
  return (
    <>
      {
        !isLoggedIn ?
          <>
            <Link to="/login" className={linkStyle}>
              <BiLogInCircle className="md:hidden block" />
              <Button>Login</Button>
            </Link>
            <Link to="/register" className={linkStyle}>
              <BiLogOutCircle className="md:hidden block" />
              <Button>SignUp</Button>
            </Link>
          </>
          : <Button onClick={handleLogout}>Logout</Button>
      }
    </>
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className="flex items-center justify-end box-border">
        <div className="flex items-center justify-between gap-4">
          {/* desktop view*/}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="border border-text rounded-lg px-2 py-1 smooth-transition focus:border-text focus:border-opacity-100 focus:outline-none placeholder-text w-[300px]"
            />
            <IoIosSearch className="absolute top-[8px] right-3 cursor-pointer text-lg" />
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <DarkModeButton />
            <NavLinks />
          </div>

        </div>

        {/* mobile view */}
        <div className="block md:hidden gap-3 flex">
          <DarkModeButton />
          <IoIosMenu
            className="block md:hidden cursor-pointer text-3xl"
            onClick={() => setIsOpen(!isOpen)} />
        </div>
      </nav>
      {
        isOpen &&
        <div className="flex basis-full flex-col gap-3 p-3 items-center text-xl">
          <NavLinks />
        </div>
      }
    </>
  )
}

export default Navbar;