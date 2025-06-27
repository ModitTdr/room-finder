import { createContext } from "react";
import { useUserStatusQuery } from "@/app/auth/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const { data: user, isLoading, isError, refetch:refetchUser } = useUserStatusQuery();

   const isAuthenticated = !!user && !isError;
   const isGuest = !user && !isLoading;
   const userRole = user?.user.role;
   const message = user?.message;

   const value = {
      isAuthenticated,
      isGuest,
      userRole,
      message,
      refetchUser
   }

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )
}