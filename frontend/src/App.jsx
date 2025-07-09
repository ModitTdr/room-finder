import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

function App() {

  return (
    <div className="bg-background text-text smooth-transition min-h-screen flex flex-col">
      <Navbar title="Room Finder" />
      <div className="pt-[64px] flex-grow"> {/* Adjust pt-[height] based on your navbar's actual height */}
        <Outlet />
      </div>
    </div>
  )
}

export default App
