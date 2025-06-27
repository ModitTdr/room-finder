import { House, List, ListFilterPlus, Search, SquareUser, Unplug, User, UsersRound } from "lucide-react";
const sidebarLinks = (isAuthenticated, isDashboard = false) => [
  {
    title: "Room",
    icon: House,
    subtitle: [
      { title: 'Browse Rooms', icon: Search, isActive: true },
      { title: 'List Rooms', icon: ListFilterPlus, isActive: isAuthenticated },
      { title: 'Add a Room', icon: List, isActive: isAuthenticated },
    ]
  },
  {
    title: "User",
    icon: User,
    subtitle: [
      { title: 'Profile', icon: SquareUser, link: '/dashboard', isActive: true },
      { title: 'All Users', icon: UsersRound, link: 'userlist', isActive: isAuthenticated },
      { title: 'Logout', icon: Unplug, link: '/logout', isActive: isAuthenticated },
    ]
  }
]

export default sidebarLinks