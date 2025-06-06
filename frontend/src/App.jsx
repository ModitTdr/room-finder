import { use, useState } from 'react'
import { Routes, Route} from "react-router";

import Navbar from "./components/Navbar/Navbar"
import Homepage from "./components/Homepage"
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup"


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-background text-text smooth-transition  p-4 lg:px-8 py-4 min-h-screen'>
      <header className='flex justify-between items-center flex-wrap w-full container m-auto'>
        <h1 className="text-3xl">Room Finder</h1>
        <Navbar />
      </header>
      <div className='container m-auto h-full my-8'>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
