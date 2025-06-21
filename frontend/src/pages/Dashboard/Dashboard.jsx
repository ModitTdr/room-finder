
import sidebarLinks from "../../data/sidebarLinks.js"
import AuthContext from "../../context/AuthContext.js"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
// import { ChevronDown } from "lucide-react";
// import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import DashboardIndex from "./Userlist/DashboardIndex.jsx";
import { Link, Outlet } from "react-router";

const Dashboard = () => {
   const { isAuthenticated } = useContext(AuthContext);
   const [expand, setExpand] = useState(false);

   const navlink = sidebarLinks(isAuthenticated);
   return (
      <div className="grid grid-cols-[200px_auto] gap-4">
         <aside className="bg-muted h-screen-hero text-foreground hidden md:block">
            {
               navlink.map(({ title, icon: Icon, subtitle }) => (
                  <Collapsible>
                     <CollapsibleTrigger className="w-full">
                        <div className="flex items-center gap-2 p-2 leading-none w-full">
                           <Icon className=" h-4 -mt-[3px]" />
                           <span className="text-sm relative ">{title}</span>
                        </div>
                     </CollapsibleTrigger>
                     <CollapsibleContent>
                        {
                           subtitle.map(({ title, icon: Icon, link = "#", isActive }) => (
                              <div className="flex items-center gap-2 p-2 leading-none w-full">
                                 <Icon className=" h-4 -mt-[3px]" />
                                 <Link to={link}>{title}</Link>
                              </div>
                           ))
                        }
                     </CollapsibleContent>
                  </Collapsible>
               ))
            }
         </aside>
         <main className="w-full overflow-hidden">
            <Outlet />
         </main>
      </div>
   )
}

export default Dashboard