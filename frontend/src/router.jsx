import { createBrowserRouter } from "react-router";
import Homepage from "./components/Homepage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import App from "./App";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: '',
                element: <Homepage/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'register',
                element: <Signup/>
            },
        ],
    },
])

export default router;