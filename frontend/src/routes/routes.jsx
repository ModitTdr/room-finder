import { createBrowserRouter } from "react-router";
import App from "../App";

import Homepage from "../pages/Homepage/HomePage.jsx";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Logout from "../pages/auth/Logout";

import { Provider } from "react-redux";
import store from "../app/store.js";

import { ThemeProvider } from "../context/ThemeContext.jsx";
import DashboardIndex from "../pages/Dashboard/Userlist/DashboardIndex.jsx";
import { userApi } from "../app/user/userApi.js";
import UserProfile from "../pages/Dashboard/UserProfile/UserProfile.jsx";

const router = createBrowserRouter([
   {
      path: '/',
      element: (
         <Provider store={store}>
            <ThemeProvider>
               <App />
            </ThemeProvider>
         </Provider>
      ),
      children: [
         {
            path: '',
            element: <Homepage />
         },
         {
            path: 'login',
            element: <LoginPage />
         },
         {
            path: 'register',
            element: <SignupPage />
         },
         {
            path: 'logout',      // <-- add this
            element: <Logout />  // <-- and this
         },
         {
            path: 'dashboard',
            element: <Dashboard />,
            children: [
               {
                  path: 'userlist',
                  element: <DashboardIndex />
               }, {
                  path: 'userprofile',
                  element: <UserProfile />
               },
            ]
         },

      ],
   },
])

export default router;