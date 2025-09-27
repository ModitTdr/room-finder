import { ChevronDown, LayoutDashboardIcon } from "lucide-react";

import { Link, useLocation } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLogout } from "@/hooks/useLogout";

export function Sidebar({ isOpen, sidebar: navlink, role }) {
  const { pathname: currentPath } = useLocation();
  const { mutate: logout } = useLogout();
  const getDashboard = () => {
    if (role === "ADMIN") {
      return "/admin";
    } else {
      return "/dashboard";
    }
  }
  return (
    <div
      className={`bg-background border-r p-4 smooth-transition h-dvh z-55 w-62 fixed top-0 left-0 md:hidden flex flex-col ${isOpen ? "translate-x-0 lg:static" : "-translate-x-full"
        }`}
    >
      <h1 className="text-2xl font-semibold mb-4 font-[Montserrat] ">
        Room Finder
      </h1>
      <ul>
        <li>
          <div className="flex items-center gap-2 bg-background cursor-pointer hover:bg-muted rounded-md p-2 mb-4">
            <LayoutDashboardIcon size="16" />
            <Link to={getDashboard()}>Dashboard</Link>
          </div>
        </li>
      </ul>
      <ul className="flex-grow">
        {navlink.map((link) => (
          <li className="mb-4" key={link.title}>
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger className="flex justify-between items-center w-full cursor-pointer hover:bg-muted rounded-md p-2 font-bold">
                <div className="flex gap-2 items-center">
                  {link.icon && <link.icon size="15" />}
                  <span>{link.title}</span>
                </div>
                <ChevronDown className="ml-auto -rotate-90 transition-transform group-data-[state=open]/collapsible:rotate-0" />
              </CollapsibleTrigger>
              <CollapsibleContent className="text-sm pl-4">
                {
                  link.subtitle
                    .filter((sub) => sub.isActive)
                    .map(({ title, icon: Icon, link = "#" }, index) => (
                      currentPath === link ? '' :
                        <div key={title} className="flex gap-2 bg-background cursor-pointer hover:bg-muted rounded-md p-2">
                          {
                            title !== 'Logout' ? (
                              <>
                                {Icon && <Icon size="16" />}
                                <Link to={link}>{title}</Link>
                              </>
                            ) : (
                              <>
                                {Icon && <Icon size="16" />}
                                <span onClick={logout}>Logout</span>
                              </>
                            )
                          }
                        </div>

                    ))}
              </CollapsibleContent>
            </Collapsible>
          </li>
        ))}
      </ul>
    </div>
  );
}
