import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "@/services/authServices";
import LoadingPage from "../pages/LoadingPage";

export function useAuth() {
    const {
        data,
        isLoading,
        isError,
        error,
        isSuccess,
        refetch
    } = useQuery({
        queryKey: ["auth"],
        queryFn: checkAuth,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
        onError: (error) => {
            console.warn("Auth check failed:", error);
        },
        throwOnError: false,
    });
    
    const isAuthenticated = !!data?.user && !isError;

    return {
        user: data?.user,
        isAuthenticated,
        isLoading,
        isError,
        isSuccess,
        error,
        refetch,
    };
}