import { useEffect } from 'react'
import { Link, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Navbar from "./components/Navbar/Navbar"
import { restoreLogin } from './store/features/auth/authSlice';
import { setLoading } from './store/features/loading/loadingSlice';
import SpinnerWithText from './components/common/SpinnerWithText';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  useEffect(() => {
    dispatch(setLoading(true))
    const token = localStorage.getItem("token");
    if (token) {
      const { id, email, role } = jwtDecode(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(restoreLogin({ id, email, role }));
    }
    setTimeout(() => dispatch(setLoading(false)), 300);
  }, []);


  return (
    <>
      {
        !isLoading ?
          <div className='bg-background text-text smooth-transition p-4 lg:px-8 py-4 h-screen flex flex-col'>
            <header className='flex justify-between items-center flex-wrap w-full container m-auto'>
              <Link to='/' className="text-3xl font-[Montserrat]">Room Finder</Link>
              <Navbar />
            </header>
            <div className='container m-auto my-8 flex-grow'>
              <Outlet />
            </div>
          </div>
          : <SpinnerWithText />
      }
    </>
  )
}

export default App
