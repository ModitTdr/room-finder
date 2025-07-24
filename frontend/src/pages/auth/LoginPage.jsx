import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { toast } from "react-hot-toast";
import GoogleLoginButton from "@/components/GoogleLoginButton"

// Services
import { loginUser } from "@/services/authServices";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



const LoginPage = () => {
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Logged in!");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center h-[80dvh] flex-col xl:flex-row gap-x-32 p-4 gap-y-8 mt-4">
      {/* Left Side */}
      <div>
        <h2 className="text-4xl xl:text-6xl xl:w-[550px] text-center font-[Montserrat]">
          Welcome Back..
        </h2>
      </div>

      {/* Right Side - Login Form */}
      <Card className="w-full max-w-sm">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" variant="accent" disabled={mutation.isPending}>
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
              <a
                href="/forgot-password"
                className="text-sm underline hover:opacity-80 text-center"
              >
                Forgot your password?
              </a>
              <div className="relative text-center text-sm after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or Continue With
                </span>
              </div>

              <GoogleLoginButton />
            </div>

            {/* Signup Link */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage