import { useContext } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'
import { ThemeContext } from './context/ThemeContext'

function App() {
  const { isDark } = useContext(ThemeContext);
  return (
    <div className={`${isDark ? 'bg-gradient-to-tr from-neutral-900 to-neutral-800' : 'bg-background'} text-text smooth-transition p-4 lg:px-8 py-4 h-screen flex flex-col`}>
      <Navbar title="Room Finder" />
      <div className='container m-auto my-8 flex-grow'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
