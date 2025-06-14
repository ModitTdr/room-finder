
import { ChevronDown } from "lucide-react";

import { Link } from "react-router";

import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./ui/collapsible"

export function Sidebar({ isOpen, sidebarLinks: navlink }) {

    return (
        <>
            <div
                className={`bg-background border-r p-4 smooth-transition h-screen z-40 w-62 fixed top-0 left-0 md:hidden ${isOpen ? 'translate-x-0 lg:static' : '-translate-x-full'}`}
            >
                <h1 className="text-2xl font-semibold mb-4 font-[Montserrat] ">Room Finder</h1>
                <ul>
                    {
                        navlink.map((link) => (
                            <li className="mb-4" key={link.title}>
                                <Collapsible defaultOpen className="group/collapsible">
                                    <CollapsibleTrigger className="flex justify-between items-center w-full cursor-pointer hover:bg-muted rounded-md p-2 font-bold">
                                        <div className="flex gap-2 items-center">
                                            {link.icon && <link.icon size="15" />}
                                            <span>{link.title}</span>
                                        </div>
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" size="16" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="text-sm">
                                        <ul className="pl-4">
                                            {
                                                link.subtitle.map(({ title, isActive = false, icon: Icon }, index) => (
                                                    isActive && (
                                                        <li
                                                            key={title || index}
                                                            className={`cursor-pointer hover:bg-muted rounded-md p-2 ${isActive ? '' : 'text-gray-500'}`} // 
                                                        >
                                                            <div className="flex gap-2">
                                                                {Icon && <Icon size="16" />}
                                                                <Link>{title}</Link>
                                                            </div>
                                                        </li>
                                                    )
                                                ))
                                            }

                                        </ul>
                                    </CollapsibleContent>
                                </Collapsible>
                            </li>
                        ))
                    }
                </ul>
            </div>

        </>
    );
}
