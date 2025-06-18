// Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserLogoutMutation } from "@/features/auth/authApi";

const Logout = () => {
   const navigate = useNavigate();
   const [logout] = useUserLogoutMutation();

   useEffect(() => {
      const doLogout = async () => {
         try {
            await logout().unwrap();
            localStorage.removeItem("token");
            navigate("/login");
         } catch (e) {
            console.error("Logout failed", e);
         }
      };
      doLogout();
   }, [logout, navigate]);

   return null; // or a spinner
};

export default Logout;
