import { useForm } from "react-hook-form";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// services
import { signupUser } from "@/services/authServices";


export default function SignupPage() {
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const mutation = useMutation({
      mutationFn: signupUser,
      onSuccess: (data) => {
         toast.success(data.message || "Account created!");
         queryClient.invalidateQueries({ queryKey: ["auth"] });
         navigate("/");
      },
      onError: (err) => {
         toast.error(err.message);
      },
   });

   const onSubmit = (data) => {
      mutation.mutate(data);
   };

   return (
      <div className="flex justify-center items-center md:h-full min-h-[85dvh] flex-col xl:flex-row gap-x-32 px-4 gap-y-8 mt-4">
         {/* left */}
         <div>
            <h2 className="text-4xl xl:text-6xl xl:w-[550px] text-center font-[Montserrat]">
               Create Your Account..
            </h2>
         </div>

         {/* right */}
         <Card className="w-full max-w-sm">
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                  {/* names */}
                  <div className="grid grid-cols-2 gap-4">
                     {/* first name */}
                     <div className="space-y-2">
                        <Label htmlFor="firstname">First Name</Label>
                        <Input
                           id="firstname"
                           type="text"
                           placeholder="John"
                           {...register("firstname", { required: "First name is required" })}
                        />
                        {errors.firstname && (
                           <p className="text-red-500 text-sm">{errors.firstname.message}</p>
                        )}
                     </div>

                     {/* last name */}
                     <div className="space-y-2">
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input
                           id="lastname"
                           type="text"
                           placeholder="Doe"
                           {...register("lastname", { required: "Last name is required" })}
                        />
                        {errors.lastname && (
                           <p className="text-red-500 text-sm">{errors.lastname.message}</p>
                        )}
                     </div>
                  </div>

                  {/* email */}
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

                  {/* password */}
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

                  {/* buttons */}
                  <div className="flex flex-col gap-3">
                     <Button type="submit" className="w-full" variant="accent" disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating Account..." : "Sign Up"}
                     </Button>

                     <div className="relative text-center text-sm after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                           Or Continue With
                        </span>
                     </div>

                     <Button variant="outline" className="w-full">
                        <FaGoogle className="mr-2" />
                        Sign up with Google
                     </Button>
                  </div>

                  {/* login route */}
                  <div className="mt-4 text-center text-sm">
                     Already have an account?{" "}
                     <a href="/login" className="underline underline-offset-4">
                        Login
                     </a>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
