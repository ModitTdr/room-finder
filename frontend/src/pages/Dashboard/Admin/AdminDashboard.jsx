import { useQuery } from "@tanstack/react-query";
import { getAllUser } from "@/services/userServices";
import UserListTable from "./UserListTable";
import LoadingPage from "../../LoadingPage";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allusers"],
    queryFn: () => getAllUser(),
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  const users = data?.data || [];

  // Calculate stats
  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Verified Users",
      value: verifiedUsers,
      icon: UserCheck,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Unverified Users",
      value: unverifiedUsers,
      icon: UserX,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Admins",
      value: adminUsers,
      icon: Shield,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen text-foreground bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold ">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Manage users and monitor system activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className=" rounded-xl shadow-sm border border-gray-600 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/80">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.lightColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Table Card */}
        <div className="rounded-xl shadow-sm border border-foreground/30 overflow-hidden">
          <div className="p-6 border-b border-foreground/40">
            <h2 className="text-xl font-semibold ">
              User Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all registered users
            </p>
          </div>
          <UserListTable data={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
