import { createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";

/* ------------- routes ------------- */
import ProtectedRoute from "@/routes/ProtectedRoute"
import RoleProtectedRoute from "@/routes/RoleProtectedRoute"
import App from "../App";
import Homepage from "@/pages/Homepage/HomePage"
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import Dashboard from "@/pages/Dashboard/Dashboard"
import AdminDashboard from "@/pages/Dashboard/Admin/AdminDashboard"
import UserProfile from "@/pages/Dashboard/UserProfile/UserProfile"
import BecomeOwner from "@/pages/Dashboard/UserProfile/BecomeOwner"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

import MissingPage from "../pages/MissingPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import AddRoom from "../pages/Dashboard/Room/AddRoom";
import RoomsIndex from "../pages/Homepage/Rooms/RoomsIndex";
import RoomList from "../pages/Dashboard/Room/RoomList";
import RoomInfoPage from "../pages/Homepage/Rooms/RoomInfoPage";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThemeProvider><App /></ThemeProvider>,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: "login",
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: "signup",
        element: <PublicRoute><SignupPage /></PublicRoute>,
      },
      {
        path: "forgot-password",
        element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
      },
      {
        path: "reset-password",
        element: <PublicRoute><ResetPasswordPage /></PublicRoute>,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        children: [
          {
            path: "userprofile",
            element: <UserProfile />
          },
          {
            path: "addroom",
            element: (
              <RoleProtectedRoute allowedRoles={['OWNER']}>
                <AddRoom />
              </RoleProtectedRoute>
            )
          },
          {
            path: "booking-request",
            element: (
              <RoleProtectedRoute allowedRoles={['OWNER']}>
                <MissingPage />
              </RoleProtectedRoute>
            )
          },
          {
            path: "favourites",
            element: <MissingPage />
          },
          {
            path: "myrooms",
            element: (
              <RoleProtectedRoute allowedRoles={['OWNER']}>
                <RoomList />
              </RoleProtectedRoute>
            )
          },
          {
            path: "become-owner",
            element: (
              <RoleProtectedRoute allowedRoles={['SEEKER']}>
                <BecomeOwner />
              </RoleProtectedRoute>
            )
          },
        ]
      },
      {
        path: "/rooms",
        element: <RoomsIndex />,
      },
      {
        path: "/rooms/:id",
        element: <RoomInfoPage />,
      },
    ]
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/admin",
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboard />
      </RoleProtectedRoute>
    )
  }

]);

export default router;
