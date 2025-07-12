// Logout.jsx
import { useEffect } from "react";
import { useUserLogoutMutation } from "@/app/auth/authApi";

const Logout = () => {
  const [logout, { isLoading: logoutLoading }] = useUserLogoutMutation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout().unwrap();
        window.location.replace('/')
      } catch (error) {
        alert('failed')
        console.log(error);
      }
    };

    handleLogout();
  }, [logout]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {logoutLoading ? (
          <p>Logging out...</p>
        ) : null}
      </div>
    </div>
  );
};

export default Logout;
