import { createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";

/* ------------- routes ------------- */
import ProtectedRoute from "@/routes/ProtectedRoute"
import App from "../App";
import Homepage from "@/pages/Homepage/HomePage"
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import Dashboard from "@/pages/Dashboard/Dashboard"
import UserProfile from "@/pages/Dashboard/UserProfile/UserProfile"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

import MissingPage from "../pages/MissingPage";
import AddRoom from "../pages/Dashboard/Room/AddRoom";
import RoomsIndex from "../pages/Homepage/Rooms/RoomsIndex";
import RoomList from "../pages/Dashboard/Room/RoomList";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ThemeProvider><App /></ThemeProvider>,
        children: [
            {
                path: "",
                element: <Homepage />
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/signup",
                element: <SignupPage />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPasswordPage />,
            },
            {
                path: "/reset-password",
                element: <ResetPasswordPage />,
            },
            {
                path: "/dashboard",
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
                children: [
                    {
                        path: "userprofile",
                        element: <UserProfile />
                    },
                    {
                        path: "addroom",
                        element: <AddRoom />
                    },
                    {
                        path: "favourites",
                        element: <MissingPage />
                    },
                    {
                        path: "myrooms",
                        element: <RoomList />
                    },
                ]
            },
            {
                path: "/rooms",
                element: <RoomsIndex />,
            },
            {
                path: "/rooms/:id",
                element: <MissingPage />,
            },

        ]
    },

]);

export default router;
