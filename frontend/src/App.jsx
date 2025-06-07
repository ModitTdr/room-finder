import { use, useState } from 'react'
import { Routes, Route, Outlet} from "react-router";

import Navbar from "./components/Navbar/Navbar"
import Homepage from "./components/Homepage"
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-background text-text smooth-transition p-4 lg:px-8 py-4 h-screen flex flex-col'>
      <header className='flex justify-between items-center flex-wrap w-full container m-auto'>
        <h1 className="text-3xl font-[Montserrat]">Room Finder</h1>
        <Navbar />
      </header>
      <div className='container m-auto my-8 flex-grow'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
