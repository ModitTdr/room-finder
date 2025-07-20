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
                path: "/dashboard",
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
                children: [
                    {
                        path: "userprofile",
                        element: <UserProfile />
                    }
                ]
            },

        ]
    },

]);

export default router;
