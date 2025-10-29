import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation } from "react-router";
import { getUser } from "@/services/userServices"
/* -------------- icons ------------- */
import { ChevronDown, LayoutDashboardIcon } from "lucide-react";

/* ------------ shadcn ui ----------- */
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"

/* ---------- custom hooks ---------- */
import { useAuth } from "@/hooks/useAuth";

/* -------- custom components ------- */
import sidebarLinks from "@/data/sidebarLinks.js"
import LoadingPage from "@/pages/LoadingPage"


const Dashboard = () => {
  const { pathname: currentPath } = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();

  const { data: user, isUserDataLoading } = useQuery({
    queryKey: ["userprofile"],
    queryFn: getUser,
  })
  console.log(user)
  if (isUserDataLoading) return <LoadingPage />
  const userRole = user?.role || "SEEKER";
  const navlink = useMemo(() => sidebarLinks(isAuthenticated, userRole), [isAuthenticated, userRole]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-[220px_auto] gap-4 h-screen-hero">
      {/* Sidebar */}
      <aside className="bg-muted text-foreground hidden md:block px-2 py-4 space-y-4">

        <div className="pb-4 border-b border-neutral-600 px-2">
          <h1 className="text-xl font-bold">Welcome Back,</h1>
          <p className="text-xs text-muted-foreground font-medium">
            {user?.name || "Loading..."}
          </p>
        </div>
        <div className="space-y-3">
          <Link to='/dashboard'>
            <div className={`flex items-center gap-2 cursor-pointer hover:bg-foreground/5 rounded-md p-2 mb-3 ${currentPath.endsWith('/dashboard') && 'font-bold'}`} >
              <LayoutDashboardIcon size="16" />
              Dashboard
            </div>
          </Link>
          {navlink.map(({ title, icon: Icon, subtitle }) => (
            <Collapsible key={title} className="group/collapsible" defaultOpen={true}>
              <CollapsibleTrigger className="w-full">
                <div className="flex w-full p-2 justify-between rounded-md hover:bg-foreground/5 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-md relative">{title}</span>
                  </div>
                  <ChevronDown className="ml-auto -rotate-90 transition-transform group-data-[state=open]/collapsible:rotate-0" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4">
                {subtitle
                  .filter((sub) => sub.isActive)
                  .map(({ title, icon: Icon, link = "#" }) => (
                    <div key={title} className={`flex gap-2 items-center cursor-pointer p-2 leading-none w-full rounded-md hover:bg-foreground/5 pt-[10px] ${currentPath.endsWith(link) && 'font-bold'}`}>
                      <Icon size={16} />
                      <Link to={link} className="text-sm">{title}</Link>
                    </div>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))
          }
        </div>
      </aside >


      {/* Main Content */}
      < main className="w-full overflow-y-scroll">
        <Outlet context={{ user }} />
      </main >
    </div >
  );
};

export default Dashboard;
