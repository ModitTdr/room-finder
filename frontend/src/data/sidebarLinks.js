import { FaHouseChimney, FaUser } from "react-icons/fa6";
import { IoIosAdd, IoIosList } from "react-icons/io";
const sidebarLinks = (isAuthenticated) => [
    {
      title: "Room",
      icon: FaHouseChimney,
      subtitle: [
        { id:1,title: 'Browse Rooms', icon: IoIosAdd, isActive: true },
        { id:2,title: 'List Rooms', icon: IoIosAdd, isActive: isAuthenticated },
        { id:3,title: 'Add a Room', icon: IoIosList, isActive: isAuthenticated },
      ]
    },
    {
      title: "User",
      icon: FaUser,
      subtitle: [
        { id:1,title: 'Profile', icon: IoIosList,link: 'dashboard', isActive: true },
        { id:2,title: 'All Users',icon: IoIosList, link: 'userlist', isActive: isAuthenticated },
        { id:3,title: 'Logout',icon: IoIosList, link: '/logout', isActive: isAuthenticated },
      ]
    }
  ]

  export default sidebarLinks