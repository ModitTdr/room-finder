import { ChevronDown } from "lucide-react";

import { Link, useLocation } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Sidebar({ isOpen, sidebar: navlink, NavLinks }) {
  const { pathname: currentPath } = useLocation();
  return (
    <div
      className={`bg-background border-r p-4 smooth-transition h-dvh z-55 w-62 fixed top-0 left-0 md:hidden flex flex-col z-55 ${
        isOpen ? "translate-x-0 lg:static" : "-translate-x-full"
      }`}
    >
      <h1 className="text-2xl font-semibold mb-4 font-[Montserrat] ">
        Room Finder
      </h1>
      <ul>
        <li>abcdord</li>
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
              <CollapsibleContent className="text-sm">
                <ul className="pl-4">
                  {
                    link.subtitle
                    .filter((sub) => sub.isActive)
                    .map(({ title, icon: Icon, link = "#" }, index) => (
                      currentPath === link ? '' :
                      <li
                        key={title || index}
                        className="cursor-pointer hover:bg-muted rounded-md p-2"
                      >
                        <div className="flex gap-2">
                          {Icon && <Icon size="16" />}
                          <Link to={link}>{title}</Link>
                        </div>
                      </li>
                    ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </li>
        ))}
      </ul>
      <div className="flex justify-between">{NavLinks}</div>
    </div>
  );
}
