import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/services/authServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            toast.success("Logged out!");
            queryClient.invalidateQueries(["auth"]);
            navigate("/login");
        },
        onError: () => {
            toast.error("Logout failed");
        },
    });
}
