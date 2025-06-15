import AuthContext from "./AuthContext";
import { useUserLoginMutation, useUserStatusQuery, useUserLogoutMutation } from "../features/auth/authApi";

const AuthContextProvider = ({ children }) => {
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
export default AuthContextProvider;