import { Link } from "react-router";
import { useMemo, useState } from "react";

import { IoIosMenu, IoIosSearch } from "react-icons/io";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { User } from "lucide-react";


const NavLinks = ({ isAuthenticated, role }) => {
  const linkStyle = "flex items-center gap-2"
  const { mutate: logout, isPending } = useLogout();

  const getDashboard = () => {
    if (role === "ADMIN") {
      return "/admin";
    } else {
      return "/dashboard";
    }
  }
  return (
    <>
      {
        isAuthenticated ?
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p className="cursor-pointer border rounded-full p-[6px] text-neutral-300 border-neutral-600/70 bg-neutral-800/95 flex justify-center items-center hover:text-accent">
                <User size={21} />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={getDashboard()} className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                {isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu >
          :
          <>
            <Link to="/login" className={linkStyle}>
              <Button className="bg-transparent border border-transparent text-neutral-100 hover:text-accent hover:bg-transparent hover:border-accent">Login</Button>
            </Link>
            <Link to="/signup" className={linkStyle}>
              <Button className="hover:text-accent hover:border-accent hover:bg-transparent bg-transparent text-neutral-100 border border-muted-foreground rounded-sm">Get Started</Button>
            </Link>
          </>

      }
    </>
  )
}

const Navbar = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  const userRole = user?.role || "SEEKER";
  const sidebar = useMemo(() => sidebarLinks(isAuthenticated, userRole), [isAuthenticated]);
  if (isLoading) return null;
  return (
    <>
      <Sidebar
        isOpen={isOpen}
        sidebar={sidebar}
        role={userRole}
      />
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav className=' w-full m-auto p-4 fixed top-0 z-50 border-b border-b-accent bg-gradient-to-r from-black/90 to bg-black/85 backdrop-blur-md '>
        <div className="container mx-auto flex justify-between items-center flex-wrap">
          <Link to='/' className="text-3xl font-[Montserrat] shrink text-neutral-100">{title}</Link>
          <div className="flex items-center justify-end box-border">
            <div className="flex items-center justify-between gap-8">
              {/* desktop view*/}
              <div className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search.."
                  className="lg:w-[300px] rounded-mdf"
                />
                <IoIosSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
              </div>
              <div className="hidden md:flex gap-4 items-center">
                {
                  isAuthenticated && userRole === "SEEKER" &&
                  <Button className="text-sm rounded-md bg-transparent border border-muted-foreground cursor-pointer text-neutral-100 hover:bg-transparent hover:text-accent hover:border-accent" >
                    <Link to="/dashboard/become-owner">
                      Become a Landlord
                    </Link>
                  </Button>
                }
                <DarkModeButton />
                <NavLinks isAuthenticated={isAuthenticated} role={userRole} />
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
