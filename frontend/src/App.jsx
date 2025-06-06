import { use, useState } from 'react'
import { Routes, Route} from "react-router";

import Navbar from "./components/Navbar/Navbar"
import Homepage from "./components/Homepage"
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup"


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div className='flex justify-center bg-amber-50'>
        <Navbar />
      </div>
      <div className='container m-auto'>
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
