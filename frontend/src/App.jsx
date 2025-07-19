import { Outlet } from "react-router-dom";
import LoadingPage from "@/pages/LoadingPage"
import Navbar from "@/components/Navbar/Navbar"
/* ---------- custom hooks ---------- */
import { useAuth } from "./hooks/useAuth";
import useDelay from "./hooks/useDelay"
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isLoading, isError } = useAuth();
  const delay = useDelay();

  if (isLoading && !isError || delay) return <LoadingPage />

  return (
    <>
      <div className="bg-background text-text smooth-transition min-h-screen flex flex-col">
        <Navbar title="Room Finder" className="relative" />
        <Toaster position="top-center" />
        <div className="pt-[64px] flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default App