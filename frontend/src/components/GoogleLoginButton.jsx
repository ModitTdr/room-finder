import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

const GoogleLoginButton = () => {
   const googleClientRef = useRef(null);
   const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

   useEffect(() => {
      const initializeGoogle = () => {
         if (window.google?.accounts?.id) {
            try {
               window.google.accounts.id.initialize({
                  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                  callback: handleCredentialResponse,
                  // Add these options for better error handling
                  auto_select: false,
                  cancel_on_tap_outside: true,
               });

               googleClientRef.current = window.google.accounts.id;
               setIsGoogleLoaded(true);
            } catch (error) {
               console.error("Failed to initialize Google Sign-In:", error);
            }
         }
      };

      // If Google is already loaded, initialize immediately
      if (window.google?.accounts?.id) {
         initializeGoogle();
      } else {
         // Otherwise, wait for it to load
         const checkGoogleLoaded = setInterval(() => {
            if (window.google?.accounts?.id) {
               initializeGoogle();
               clearInterval(checkGoogleLoaded);
            }
         }, 100);

         // Clean up interval after 10 seconds
         setTimeout(() => clearInterval(checkGoogleLoaded), 10000);

         return () => clearInterval(checkGoogleLoaded);
      }
   }, []);

   const handleCredentialResponse = async (response) => {
      const token = response.credential; // Google ID Token

      try {
         const res = await axios.post("/auth/google-login", { token });
         console.log("Logged in user:", res.data);
         // store your app's token, navigate, etc.
      } catch (err) {
         console.error("Google login failed:", err);
      }
   };

   const handleLoginClick = () => {
      if (!isGoogleLoaded) {
         console.error("Google Sign-In not loaded yet");
         alert("Google Sign-In is loading. Please try again in a moment.");
         return;
      }

      if (googleClientRef.current) {
         try {
            googleClientRef.current.prompt();
         } catch (error) {
            console.error("Failed to show Google Sign-In prompt:", error);
            alert("Unable to show login prompt. Please refresh the page and try again.");
         }
      }
   };

   return (
      <Button
         onClick={handleLoginClick}
         variant="outline"
         className="w-full"
         type="button"
         disabled={!isGoogleLoaded}
      >
         <FaGoogle className="mr-2" />
         {isGoogleLoaded ? "Login with Google" : "Loading..."}
      </Button>
   );
};

export default GoogleLoginButton;