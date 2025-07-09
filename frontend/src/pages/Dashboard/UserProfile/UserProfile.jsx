import { useAuth } from "@/hooks/useAuth.js"
import { useGetUserQuery } from "@/app/user/userApi";

const UserProfile = () => {
    const { userData, isLoading } = useAuth();
    const { data: user } = useGetUserQuery(userData?.id);

    return (
        <div className="py-8 container mx-auto">
            {/* topbar */}
            <div className='flex items-center gap-4 bg-red-300/30'>
                <div className="rounded-full w-38 h-38 rounded-full border border-muted-foreground/40 border-2">
                    <img src="/ktm.png" alt="" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{user?.name}</h1>
                    <div>
                        <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
                        <p className="text-sm text-muted-foreground">Phone: {user?.phone}</p>
                        <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile