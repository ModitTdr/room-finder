import { Link } from "react-router";
import { useContext, useMemo, useState } from "react";

import { IoIosMenu, IoIosSearch, IoIosAdd, IoIosList } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

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
import sidebarLinks from "../../data/sidebarLinks"



const NavLinks = ({ isAuthenticated }) => {
  const linkStyle = "flex items-center gap-2"

  return (
    <>
      {
        isAuthenticated ?
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p className="cursor-pointer border rounded-full p-[6px] text-muted-foreground bg-muted flex justify-center items-center">
                <FaRegUser size="20" />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to='/dashboard' className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to='/logout' className="w-full">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          :
          <>
            <Link to="/login" className={linkStyle}>
              <Button className="bg-transparent text-foreground hover:text-background">Login</Button>
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
  const sidebar = useMemo(() => sidebarLinks(isAuthenticated), [isAuthenticated]);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Sidebar isOpen={isOpen} sidebar={sidebar} NavLinks={isAuthenticated ? null : <NavLinks isAuthenticated={isAuthenticated} />} />
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav className=' w-full m-auto p-4 fixed top-0 z-50 border-b border-b-muted bg-gradient-to-r from-background/90 to-muted/80 backdrop-blur-md '>
        <div className="container mx-auto flex justify-between items-center flex-wrap px-4">
          <Link to='/' className="text-3xl font-[Montserrat] shrink">{title}</Link>
          <div className="flex items-center justify-end box-border">
            <div className="flex items-center justify-between gap-8">
              {/* desktop view*/}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search.."
                  className="border border-text rounded-xl px-4 py-1 smooth-transition focus:border-text focus:border-opacity-100 focus:outline-none placeholder-text lg:w-[300px]"
                />
                <IoIosSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
              </div>
              <div className="hidden md:flex gap-4 items-center">
                {isAuthenticated && <Button className="text-sm rounded-xl" variant="outline">Become a Landlord</Button>}
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
        </div>
      </nav>

    </>
  )
}

export default Navbar;
