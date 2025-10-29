import { Heart, House, List, ListFilterPlus, Search, SquareUser, Unplug, User, UserCheck, UserPlus, UsersRound, Calendar } from "lucide-react";
const sidebarLinks = (isAuthenticated = false, userRole) => [
  {
    title: "Room",
    icon: House,
    subtitle: [
      { title: 'Browse Rooms', icon: Search, link: '/rooms', isActive: (isAuthenticated, (userRole === "SEEKER")) },
      { title: 'Favourites', icon: Heart, link: 'favourites', isActive: (isAuthenticated, (userRole === "SEEKER")) },
      { title: 'List Rooms', icon: ListFilterPlus, link: '/dashboard/myrooms', isActive: (isAuthenticated, (userRole === "OWNER")) },
      { title: 'Add a Room', icon: List, link: '/dashboard/addroom', isActive: (isAuthenticated, (userRole === "OWNER")) },
      { title: 'Booking Request', icon: Calendar, link: '/dashboard/booking-request', isActive: (isAuthenticated, (userRole === "OWNER")) },
    ]
  },
  {
    title: "User",
    icon: User,
    subtitle: [
      { title: 'Profile', icon: SquareUser, link: '/dashboard/userprofile', isActive: isAuthenticated },
      { title: 'All Users', icon: UsersRound, link: '/dashboard/userlist', isActive: (isAuthenticated, (userRole === "ADMIN")) },
      { title: 'Login', icon: UserCheck, link: '/login', isActive: !isAuthenticated },
      { title: 'Get Started', icon: UserPlus, link: '/signup', isActive: !isAuthenticated },
      { title: 'Logout', icon: Unplug, link: '/logout', isActive: isAuthenticated },
    ]
  }
]

export default sidebarLinks
