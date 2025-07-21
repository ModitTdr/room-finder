// src/pages/ForgotPasswordPage.jsx

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { forgotPasswordRequest } from "@/services/authServices"; // create this
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
   const { register, handleSubmit, formState: { errors } } = useForm();

   const onSubmit = async (data) => {
      try {
         await forgotPasswordRequest(data.email);
         toast.success("Reset email sent. Check your inbox!");
      } catch (error) {
         toast.error(error.message || "Failed to send email");
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold">Forgot Password</h2>
            <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="you@example.com"
               />
               {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full">Send Reset Link</Button>
         </form>
      </div>
   );
};

export default ForgotPasswordPage;
