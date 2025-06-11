import { createBrowserRouter } from "react-router";
import Homepage from "./components/Homepage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import App from "./App";
import PublicRoute from "./components/Auth/PublicRoute"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <Homepage />
            },
            {
                path: 'login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                )
            },
            {
                path: 'register',
                element: (
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                )
            },
        ],
    },
])

export default router;