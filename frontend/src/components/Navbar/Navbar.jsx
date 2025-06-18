import { Link } from "react-router";
import { useContext, useMemo, useState } from "react";

import { FaHouseChimney, FaUser } from "react-icons/fa6";
import { IoIosMenu, IoIosSearch, IoIosAdd, IoIosList } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import DarkModeButton from "@/components/DarkModeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import AuthContext from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";



const NavLinks = ({ isAuthenticated }) => {
  const linkStyle = "flex items-center gap-2"

  return (
    <>
      {
        isAuthenticated ?
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
              <DropdownMenuItem >
                <Link to='/logout'>Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          :
          <>
            <Link to="/login" className={linkStyle}>
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register" className={linkStyle}>
              <Button>SignUp</Button>
            </Link>
          </>

      }
    </>
  )
}

const Navbar = ({ title }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const sidebarLinks = useMemo(() => [
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
        { title: 'Profile', isActive: true },
        { title: 'Logout', link: '/logout', isActive: isAuthenticated },
      ]
    }
  ], [isAuthenticated]);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Sidebar isOpen={isOpen} sidebarLinks={sidebarLinks} NavLinks={isAuthenticated ? null : <NavLinks isAuthenticated={isAuthenticated} />} />
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav className='flex justify-between items-center flex-wrap w-full container m-auto z-10 bg-background/5 p-4 rounded-md'>
        <Link to='/' className="text-3xl font-[Montserrat] shrink">{title}</Link>
        <div className="flex items-center justify-end box-border">
          <div className="flex items-center justify-between gap-8">
            {/* desktop view*/}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="border border-text rounded-lg px-2 py-1 smooth-transition focus:border-text focus:border-opacity-100 focus:outline-none placeholder-text lg:w-[300px]"
              />
              <IoIosSearch className="absolute top-[8px] right-3 cursor-pointer text-lg" />
            </div>
            <div className="hidden md:flex gap-4 items-center">
              {isAuthenticated && <Button className="text-sm" variant="outline">Become a Landlord</Button>}
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
