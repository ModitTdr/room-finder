
import sidebarLinks from "../../data/sidebarLinks.js"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react";
// import { Link } from "react-router";
import { useContext, useState, useEffect, useMemo } from "react";
import DashboardIndex from "./Userlist/DashboardIndex.jsx";
import { Link, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserQuery } from "../../app/user/userApi.js";

const Dashboard = () => {
   const { isAuthenticated, userData, isLoading } = useAuth();
   const { data } = useGetUserQuery(userData?.id, { skip: !userData?.id });
   const navlink = useMemo(() => sidebarLinks(isAuthenticated), [isAuthenticated]);
   if (isLoading) { return <div>test</div> }
   
   return (
      <div className="grid grid-cols-[200px_auto] gap-4">
         <aside className="bg-muted h-screen-hero text-foreground hidden md:block">
            <h2>Hi,{data?.name}</h2>
            {
               navlink.map(({ id, title, icon: Icon, subtitle }) => (
                  <Collapsible key={id}>
                     <CollapsibleTrigger className="w-full">
                        <div className="flex w-full p-2 justify-between">
                           <div className="flex items-center gap-2">
                              <Icon className=" h-4 -mt-[3px]" />
                              <span className="text-sm relative ">{title}</span>
                           </div>
                           <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" size="16" />
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