import { Heart, House, List, ListFilterPlus, Search, SquareUser, Unplug, User, UserCheck, UserPlus, UsersRound } from "lucide-react";
const sidebarLinks = (isAuthenticated = false, userRole) => [
  {
    title: "Room",
    icon: House,
    subtitle: [
      { title: 'Browse Rooms', icon: Search, link: '/rooms', isActive: true },
      { title: 'List Rooms', icon: ListFilterPlus, link: 'myrooms', isActive: (isAuthenticated, (userRole === "OWNER")) },
      { title: 'Add a Room', icon: List, link: 'addroom', isActive: (isAuthenticated, (userRole === "OWNER")) },
      { title: 'Favourites', icon: Heart, link: 'favourites', isActive: isAuthenticated },
    ]
  },
  {
    title: "User",
    icon: User,
    subtitle: [
      { title: 'Profile', icon: SquareUser, link: 'userprofile', isActive: isAuthenticated },
      { title: 'All Users', icon: UsersRound, link: 'userlist', isActive: (isAuthenticated, (userRole === "ADMIN")) },
      { title: 'Login', icon: UserCheck, link: '/login', isActive: !isAuthenticated },
      { title: 'Get Started', icon: UserPlus, link: '/signup', isActive: !isAuthenticated },
      { title: 'Logout', icon: Unplug, link: '/logout', isActive: isAuthenticated },
    ]
  }
]

export default sidebarLinks