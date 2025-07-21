import { Heart, House, List, ListFilterPlus, Search, SquareUser, Unplug, User, UsersRound } from "lucide-react";
const sidebarLinks = (isAuthenticated = false, userRole) => [
  {
    title: "Room",
    icon: House,
    subtitle: [
      { title: 'Browse Rooms', icon: Search, isActive: true },
      { title: 'List Rooms', icon: ListFilterPlus, isActive: (isAuthenticated, (userRole === "OWNER")) },
      { title: 'Add a Room', icon: List, isActive: (isAuthenticated, (userRole === "OWNER")) },
      { title: 'Favourites', icon: Heart, isActive: isAuthenticated },
    ]
  },
  {
    title: "User",
    icon: User,
    subtitle: [
      { title: 'Profile', icon: SquareUser, link: 'userprofile', isActive: isAuthenticated },
      { title: 'All Users', icon: UsersRound, link: 'userlist', isActive: (isAuthenticated, (userRole === "ADMIN")) },
      { title: 'Logout', icon: Unplug, isActive: isAuthenticated },
    ]
  }
]

export default sidebarLinks