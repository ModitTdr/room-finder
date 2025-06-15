import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";

//components
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"

//icons
import { FaGoogle } from "react-icons/fa";
import { Info, CheckCircle } from "lucide-react"
import FormData from "./FormData";

//redux
import { useUserLoginMutation } from "../../features/auth/authApi";
import LoadingPage from "../LoadingPage";

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);
  const [loginFn, { error, isSuccess, isLoading }] = useUserLoginMutation();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const userLogin = async (e) => {
    e.preventDefault();
    loginFn(form);
  }
  if (isSuccess) { navigate('/') }
  useEffect(() => {
    if (error) {
      setMessage(error?.data?.message || "Login Failed");
    }
  }, [error])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex justify-center items-center md:h-full h-[80dvh] flex-col xl:flex-row gap-x-32 p-4 gap-y-8">
      {/* left */}
      <div >
        <h2 className="text-4xl xl:text-6xl xl:w-[550px] text-center font-[Montserrat]">Welcome Back..</h2>
      </div>

      {/* right */}
      <Card className="w-full max-w-sm">
        <CardContent>
          <form onSubmit={userLogin}>
            <div className="flex flex-col gap-6">
              {/* email */}
              <div className="grid gap-3">
                <FormData
                  label="Email"
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
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
                <FormData id="password" type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>

              {/* submit/google login */}
              <div className="flex flex-col gap-3">
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
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* alert message */}
      <AnimatePresence>
        {message &&
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

export default Login