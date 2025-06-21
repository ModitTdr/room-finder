import { FaHouseChimney, FaUser } from "react-icons/fa6";
import { IoIosAdd, IoIosList } from "react-icons/io";
const sidebarLinks = (isAuthenticated) => [
    {
      title: "Room",
      icon: FaHouseChimney,
      subtitle: [
        { title: 'Browse Rooms', icon: IoIosAdd, isActive: true },
        { title: 'List Rooms', icon: IoIosAdd, isActive: isAuthenticated },
        { title: 'Add a Room', icon: IoIosList, isActive: isAuthenticated },
      ]
    },
    {
      title: "User",
      icon: FaUser,
      subtitle: [
        { title: 'Profile', icon: IoIosList,link: 'dashboard', isActive: true },
        { title: 'All Users',icon: IoIosList, link: 'userlist', isActive: isAuthenticated },
        { title: 'Logout',icon: IoIosList, link: '/logout', isActive: isAuthenticated },
      ]
    }
  ]

  export default sidebarLinks