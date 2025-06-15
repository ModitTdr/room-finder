import { createBrowserRouter } from "react-router";
import App from "../App";

import Homepage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import Dashboard from "../pages/Dashboard";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { authApi } from "../features/auth/authApi.js";
import AuthContextProvider from "../context/AuthContextProvider.jsx";
import { ThemeProvider } from "../context/ThemeContext.jsx";


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
            path: 'dashboard',
            element: <Dashboard />
         },
      ],
   },
])

export default router;