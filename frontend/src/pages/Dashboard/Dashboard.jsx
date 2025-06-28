
import sidebarLinks from "../../data/sidebarLinks.js"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserQuery } from "../../app/user/userApi.js";

const Dashboard = () => {
   const { pathname: currentPath } = useLocation();
   const { isAuthenticated, userData, isLoading } = useAuth();
   const { data } = useGetUserQuery(userData?.id, { skip: !userData?.id });
   console.log(data);
   
   const navlink = useMemo(() => sidebarLinks(isAuthenticated, true), [isAuthenticated]);
   if (isLoading) { return <div>test</div> }

   return (
      <div className="grid grid-cols-[200px_auto] gap-4 h-screen-hero ">
         <aside className="bg-neutral-900 text-foreground hidden md:block px-2 py-4 space-y-4 ">
            <div className="pb-4 border-b border-neutral-600">
               <h1 className="text-xl font-bold">Welcome Back,</h1>
               <p className="text-xs text-muted-foreground font-medium">{data?.name}</p>
            </div>
            <div className="space-y-3  ">
               {
                  navlink.map(({ title, icon: Icon, subtitle }) => (
                     <Collapsible key={title} className="group/collapsible" defaultOpen={true}>
                        <CollapsibleTrigger className="w-full" >
                           <div className="flex w-full p-2 justify-between rounded-md hover:bg-foreground/5  cursor-pointer">
                              <div className="flex items-center gap-2 ">
                                 <Icon size={16} />
                                 <span className="text-md relative ">{title}</span>
                              </div>
                              <ChevronDown className="ml-auto -rotate-90 transition-transform group-data-[state=open]/collapsible:rotate-0" />
                           </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           {
                              subtitle.map(({ title, icon: Icon, link = "#", isActive }) => (
                                 <div key={title} className={`flex items-center gap-3 p-2 leading-none w-full rounded-md hover:bg-foreground/5 pl-5 pt-[10px] ${currentPath.endsWith(link) && 'font-bold'}`}>
                                    <Icon size={16} />
                                    <Link to={link} className="text-sm">{title}</Link>
                                 </div>
                              ))
                           }
                        </CollapsibleContent>
                     </Collapsible>
                  ))
               }
            </div>
         </aside>
         <main className="w-full overflow-y-scroll">
            <Outlet />
         </main>
      </div>
   )
}

export default Dashboard