import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar"
/* ---------- custom hooks ---------- */
import { Toaster } from "react-hot-toast";
const App = () => {

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