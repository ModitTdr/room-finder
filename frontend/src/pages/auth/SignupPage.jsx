import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

//components
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"

//icons
import { FaGoogle } from "react-icons/fa";
import { Info } from "lucide-react"
import { useUserRegisterMutation } from "../../features/auth/authApi";
import FormData from "./FormData";


const SignupPage = () => {
   const [userData, setUserData] = useState({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      address: '',
      phone: ''
   });
   const [message, setMessage] = useState(null)
   const [registerFn, { error, isSuccess }] = useUserRegisterMutation();


   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData((prev) => ({
         ...prev,
         [name]: value
      }))
   }
   const userRegister = (e) => {
      e.preventDefault();
      registerFn(userData);
   }
   useEffect(() => {
      if (error) {
         setMessage(error?.data?.message || "Registration failed.");
      }
   }, [error]);

   useEffect(() => {
      if (message) {
         const timer = setTimeout(() => {
            setMessage(null);
         }, 3000);

         return () => clearTimeout(timer);
      }
   }, [message]);

   return (
      <div className="flex justify-center items-center md:h-full min-h-[85dvh] flex-col xl:flex-row gap-x-32 px-4 gap-y-8">
         {/* left */}
         <div>
            <h2 className="text-4xl xl:text-6xl xl:w-[550px] text-center font-[Montserrat]">Create Your Account..</h2>
         </div>

         {/* right */}
         <Card className="w-full max-w-sm smooth-transition">
            <CardContent>
               <form onSubmit={userRegister}>
                  {/* forms */}
                  <div className="flex flex-col gap-6">
                     {/* names */}
                     <div className="grid grid-cols-2 gap-4">
                        {/* firstname */}
                        <div className="grid gap-3">
                           <FormData
                              label="First name"
                              id="firstname"
                              type="text"
                              name="firstname"
                              value={userData.firstname}
                              onChange={handleChange}
                              placeholder="John"
                              required
                           />
                        </div>
                        {/* lastname */}
                        <div className="grid gap-3">
                           <FormData
                              label="Last Name"
                              id="lastname"
                              type="text"
                              name="lastname"
                              value={userData.lastname}
                              onChange={handleChange}
                              placeholder="Doe"
                              required
                           />
                        </div>
                     </div>

                     {/* email */}
                     <div className="grid gap-3">
                        <FormData
                           label="Email"
                           id="email"
                           type="email"
                           name="email"
                           value={userData.email}
                           onChange={handleChange}
                           placeholder="m@example.com" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        {/* phone */}
                        <div className="grid gap-3">
                           <FormData
                              label="Phone Number"
                              id="phone"
                              type="number"
                              name="phone"
                              value={userData.phone}
                              onChange={handleChange} />
                        </div>
                        {/* address */}
                        <div className="grid gap-3">
                           <FormData
                              label="Address"
                              id="address"
                              type="string"
                              name="address"
                              value={userData.address}
                              onChange={handleChange} />
                        </div>
                     </div>

                     {/* password */}
                     <div className="grid gap-3">
                        <div className="flex items-center">
                           <Label htmlFor="password">Password</Label>
                           <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                           >
                              Forgot your password?
                           </a>
                        </div>
                        <FormData
                           id="password"
                           type="password"
                           name="password"
                           value={userData.password}
                           onChange={handleChange}
                           required />
                     </div>

                     {/* submit/google login */}
                     <div className="flex flex-col gap-3 smooth-transition">
                        <Button type="submit" className="w-full">
                           Login
                        </Button>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                           <span className="bg-card text-muted-foreground relative z-10 px-2">
                              Or Continue With
                           </span>
                        </div>
                        <Button variant="outline" className="w-full">
                           <FaGoogle />Login with Google
                        </Button>
                     </div>
                  </div>

                  {/* route to register */}
                  <div className="mt-4 text-center text-sm">
                     Already have an account?{" "}
                     <Link to="/login" className="underline underline-offset-4">
                        Login
                     </Link>
                  </div>
               </form>
            </CardContent>
         </Card>

         {/* alert message */}
         <AnimatePresence>
            {
               message &&
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-12 smooth-transition"
               >
                  <Alert variant="destructive">
                     <Info className="h-4 w-4" />
                     <AlertTitle>{`Error`}</AlertTitle>
                     <AlertDescription>
                        {message}
                     </AlertDescription>
                  </Alert>
               </motion.div>
            }
         </AnimatePresence>
      </div>
   )
}

export default SignupPage;