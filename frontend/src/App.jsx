import { useContext } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from 'react-router'
import { ThemeContext } from './context/ThemeContext'

function App() {
  const { isDark } = useContext(ThemeContext);
  return (
    <div className={`${isDark ? 'bg-gradient-to-tr from-black to-neutral-800' : 'bg-background'} text-text smooth-transition pt-4 px-2 lg:px-8 min-h-screen flex flex-col`}>
      <Navbar title="Room Finder" />
      {/* body */}
      <div className='container m-auto grow z-1'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
