import { createBrowserRouter } from "react-router";
import App from "../App";

import Homepage from "../pages/Homepage/HomePage.jsx";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Logout from "../pages/auth/Logout";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { authApi } from "../features/auth/authApi.js";
import AuthContextProvider from "../context/AuthContextProvider.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";
import DashboardIndex from "../pages/Dashboard/Userlist/DashboardIndex.jsx";


const router = createBrowserRouter([
   {
      path: '/',
      element: (
         <ApiProvider api={authApi}>
            <AuthContextProvider>
               <ThemeProvider>
                  <App />
               </ThemeProvider>
            </AuthContextProvider>
         </ApiProvider>
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
               },
            ]
         },

      ],
   },
])

export default router;