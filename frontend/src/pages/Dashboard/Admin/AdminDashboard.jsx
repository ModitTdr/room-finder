import { useQuery } from "@tanstack/react-query";
import { getAllUser } from "@/services/userServices";
import LoadingPage from "../../LoadingPage";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Home,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["allusers"],
    queryFn: () => getAllUser(),
  });

  // Fetch rooms
  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ["allrooms"],
    queryFn: async () => {
      const response = await axios.get(`${API}/rooms`, { withCredentials: true });
      return response.data;
    },
  });

  // Fetch all payments/transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["alltransactions"],
    queryFn: async () => {
      const response = await axios.get(`${API}/admin/transactions`, { withCredentials: true });
      return response.data;
    },
  });

  if (usersLoading || roomsLoading || transactionsLoading) {
    return <LoadingPage />;
  }

  const users = usersData?.data || [];
  const rooms = roomsData || [];
  const transactions = transactionsData || [];

  // Calculate user stats
  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;
  const ownerUsers = users.filter(u => u.role === 'OWNER').length;
  const seekerUsers = users.filter(u => u.role === 'SEEKER').length;

  // Calculate room stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.available).length;
  const bookedRooms = totalRooms - availableRooms;

  // Calculate transaction stats
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;
  const failedTransactions = transactions.filter(t => t.status === 'FAILED').length;
  const totalRevenue = transactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  // Recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent users (last 5)
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const mainStats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: `+${seekerUsers + ownerUsers} active`
    },
    {
      title: "Total Rooms",
      value: totalRooms,
      icon: Home,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: `${availableRooms} available`
    },
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      change: `${completedTransactions} completed`
    },
    {
      title: "Transactions",
      value: totalTransactions,
      icon: TrendingUp,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: `${pendingTransactions} pending`
    }
  ];

  const userStats = [
    { title: "Verified Users", value: verifiedUsers, icon: UserCheck, color: "text-green-600" },
    { title: "Unverified Users", value: unverifiedUsers, icon: UserX, color: "text-orange-600" },
    { title: "Admins", value: adminUsers, icon: Shield, color: "text-purple-600" },
    { title: "Owners", value: ownerUsers, icon: Users, color: "text-blue-600" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen text-foreground bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Monitor your platform's performance and key metrics
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-neutral-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`${stat.lightColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Stats */}
        <Card className="bg-neutral-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="flex items-center space-x-3 p-3 bg-neutral-950 rounded-lg">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <div>
                      <p className="text-xs text-gray-400">{stat.title}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card className="bg-neutral-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No transactions yet</p>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">Rs. {transaction.amount}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="bg-neutral-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No users yet</p>
                ) : (
                  recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card className="bg-neutral-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-neutral-950 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Available Rooms</p>
                <p className="text-2xl font-bold text-green-500">{availableRooms}</p>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Booked Rooms</p>
                <p className="text-2xl font-bold text-orange-500">{bookedRooms}</p>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Completed Payments</p>
                <p className="text-2xl font-bold text-blue-500">{completedTransactions}</p>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Failed Payments</p>
                <p className="text-2xl font-bold text-red-500">{failedTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
