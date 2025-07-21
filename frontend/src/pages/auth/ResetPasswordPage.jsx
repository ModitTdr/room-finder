// src/pages/ResetPasswordPage.jsx

import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { resetPassword } from "@/services/authServices"; // create this
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPasswordPage = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const token = searchParams.get("token");
   const id = searchParams.get("id");

   const { register, handleSubmit, formState: { errors } } = useForm();

   const onSubmit = async ({ newPassword }) => {
      try {
         await resetPassword({ id, token, newPassword });
         toast.success("Password reset successful");
         navigate("/login");
      } catch (err) {
         toast.error(err.message || "Password reset failed");
      }
   };

   if (!token || !id) {
      return <p className="text-center text-red-500">Invalid or expired reset link</p>;
   }

   return (
      <div className="flex items-center justify-center min-h-screen">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <div className="space-y-2">
               <Label htmlFor="newPassword">New Password</Label>
               <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword", {
                     required: "Password is required",
                     minLength: { value: 8, message: "At least 8 characters" }
                  })}
               />
               {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full">Reset Password</Button>
         </form>
      </div>
   );
};

export default ResetPasswordPage;
