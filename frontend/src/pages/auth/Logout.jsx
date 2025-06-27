// Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserLogoutMutation } from "@/app/auth/authApi";

const Logout = () => {
  const navigate = useNavigate();
  const [logout, { isLoading: logoutLoading }] = useUserLogoutMutation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout().unwrap();
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } catch (error) {
        alert('failed')
        console.log(error);
      }
    };
    
    handleLogout(); 
  }, [logout, navigate]);
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
