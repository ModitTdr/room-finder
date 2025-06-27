import { useUserStatusQuery } from "@/app/auth/authApi";

export const useAuth = () => {
    const { data, error, isLoading, refetch } = useUserStatusQuery();
    return {
        userData: data?.user || null,
        isAuthenticated: !!(data?.user),
        isLoading,
        error: error?.data?.message || error?.message,
        refreshUser: refetch,
    }
}