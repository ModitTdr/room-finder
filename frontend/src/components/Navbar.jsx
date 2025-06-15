import { Link } from "react-router";
import { useContext, useState } from "react";

import { FaHouseChimney, FaUser } from "react-icons/fa6";
import { IoIosMenu, IoIosSearch, IoIosAdd, IoIosList } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";

import { Button } from "./ui/button";
import DarkModeButton from "./DarkModeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "./ui/dropdown-menu"


import { useUserLogoutMutation } from "../features/auth/authApi";
import AuthContext from "../context/AuthContext";
import { Sidebar } from "./Sidebar";



const NavLinks = ({ isAuthenticated }) => {
  const linkStyle = "flex items-center gap-2"

  const [logout] = useUserLogoutMutation();
  const handleLogout = async () => {
    await logout();
  }
  return (
    <>
      {
        isAuthenticated ?
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FaRegUser size="20" className="text-" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to='/dashboard'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
          :
          <>
            <Link to="/login" className={linkStyle}>
              <BiLogInCircle className="md:hidden block" />
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register" className={linkStyle}>
              <BiLogOutCircle className="md:hidden block" />
              <Button>SignUp</Button>
            </Link>
          </>

      }
    </>
  )
}

const Navbar = ({ title }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const sidebarLinks = [
    {
      title: "Room",
      icon: FaHouseChimney,
      subtitle: [
        { title: 'Browse Rooms', icon: IoIosAdd, isActive: true },
        { title: 'List Rooms', icon: IoIosAdd, isActive: isAuthenticated },
        { title: 'Add a Room', icon: IoIosList, isActive: isAuthenticated },
      ]
    },
    {
      title: "User",
      icon: FaUser,
      subtitle: [
        { title: 'test', isActive: true },
      ]
    }
  ]
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className='flex justify-between items-center flex-wrap w-full container m-auto z-10 bg-background/10 p-4 rounded-md'>
        <Sidebar isOpen={isOpen} sidebarLinks={sidebarLinks} />
        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
        <Link to='/' className="text-3xl font-[Montserrat]">{title}</Link>
        <div className="flex items-center justify-end box-border">
          <div className="flex items-center justify-between gap-8">
            {/* desktop view*/}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="border border-text rounded-lg px-2 py-1 smooth-transition focus:border-text focus:border-opacity-100 focus:outline-none placeholder-text w-[300px]"
              />
              <IoIosSearch className="absolute top-[8px] right-3 cursor-pointer text-lg" />
            </div>
            {isAuthenticated && <Button className="text-sm" variant="outline">Becoming a Landlord</Button>}
            <div className="hidden md:flex gap-4 items-center">
              <DarkModeButton />
              <NavLinks isAuthenticated={isAuthenticated} />
            </div>

          </div>
          {/* mobile view */}
          <div className="block md:hidden gap-3 flex">
            <DarkModeButton />
            <IoIosMenu
              className="block md:hidden cursor-pointer text-3xl"
              onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>
      </nav>

    </>
  )
}

export default Navbar;
