import { Link } from "react-router";
import { useMemo, useState } from "react";

import { IoIosMenu, IoIosSearch } from "react-icons/io";
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

import { Sidebar } from "./Sidebar";
import sidebarLinks from "../../data/sidebarLinks"
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";


const NavLinks = ({ isAuthenticated }) => {
  const linkStyle = "flex items-center gap-2"
  const { mutate: logout, isPending } = useLogout();
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
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                {isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu >
          :
          <>
            <Link to="/login" className={linkStyle}>
              <Button className="bg-transparent border border-transparent text-foreground hover:text-accent hover:bg-transparent hover:border-accent">Login</Button>
            </Link>
            <Link to="/signup" className={linkStyle}>
              <Button variant="outline" className="hover:text-accent hover:border-accent">Get Started</Button>
            </Link>
          </>

      }
    </>
  )
}

const Navbar = ({ title }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const sidebar = useMemo(() => sidebarLinks(isAuthenticated), [isAuthenticated]);
  const navLinksContent = <NavLinks isAuthenticated={isAuthenticated} />;
  if (isLoading) return null;

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Sidebar
        isOpen={isOpen}
        sidebar={sidebar}
        NavLinks={!isAuthenticated ? navLinksContent : null}
      />
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav className=' w-full m-auto p-4 fixed top-0 z-50 border-b border-b-accent bg-gradient-to-r from-background/90 to-muted/80 backdrop-blur-md '>
        <div className="container mx-auto flex justify-between items-center flex-wrap">
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
            <div className="md:hidden gap-3 flex items-center">
              <DarkModeButton />
              <IoIosMenu
                className="block md:hidden cursor-pointer text-3xl text-accent"
                onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>
        </div>
      </nav>

    </>
  )
}

export default Navbar;
