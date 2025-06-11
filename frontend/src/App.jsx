import { useEffect } from 'react'
import { Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import axios from 'axios';

import Navbar from "./components/Navbar/Navbar"
import { restoreLogin } from './store/features/auth/authSlice';

function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { id, email, role } = jwtDecode(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(restoreLogin({ id, email, role }));
    }
  }, []);


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
