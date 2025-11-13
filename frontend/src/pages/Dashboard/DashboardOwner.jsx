import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingPage from "@/pages/LoadingPage";

const API = import.meta.env.VITE_API_URL;

const OwnerDashboard = () => {
  // Fetch owner's rooms
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["my-rooms"],
    queryFn: async () => {
      const response = await axios.get(`${API}/rooms/me/rooms`, {
        withCredentials: true
      });
      return response.data;
    },
  });

  // Fetch received bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["received-bookings"],
    queryFn: async () => {
      const response = await axios.get(`${API}/bookings/received`, {
        withCredentials: true
      });
      return response.data;
    },
  });

  if (roomsLoading || bookingsLoading) {
    return <LoadingPage />;
  }

  const myRooms = rooms || [];
  const myBookings = bookings || [];

  // Calculate stats
  const totalRooms = myRooms.length;
  const availableRooms = myRooms.filter(r => r.available).length;
  const bookedRooms = totalRooms - availableRooms;

  const totalBookings = myBookings.length;
  const pendingBookings = myBookings.filter(b => b.status === 'PENDING').length;
  const acceptedBookings = myBookings.filter(b => b.status === 'ACCEPTED').length;
  const completedBookings = myBookings.filter(b => b.status === 'COMPLETED').length;

  // Calculate revenue (from completed bookings)
  const totalRevenue = myBookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.room.price, 0);

  // Calculate potential revenue (from pending + accepted)
  const potentialRevenue = myBookings
    .filter(b => b.status === 'PENDING' || b.status === 'ACCEPTED')
    .reduce((sum, b) => sum + b.room.price, 0);

  // Recent bookings (last 5)
  const recentBookings = [...myBookings]
    .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    .slice(0, 5);

  const mainStats = [
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      description: `${completedBookings} completed bookings`
    },
    {
      title: "Total Rooms",
      value: totalRooms,
      icon: Home,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: `${availableRooms} available`
    },
    {
      title: "Pending Requests",
      value: pendingBookings,
      icon: Clock,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      description: "Awaiting your response"
    },
    {
      title: "Potential Revenue",
      value: `Rs. ${potentialRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: "From pending/accepted"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-200 text-yellow-700', label: 'Pending' },
      ACCEPTED: { color: 'bg-green-200 text-green-700', label: 'Accepted' },
      REJECTED: { color: 'bg-red-200 text-red-700', label: 'Rejected' },
      CANCELLED: { color: 'bg-gray-200 text-gray-700', label: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-200 text-blue-700', label: 'Completed' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your properties and track your earnings
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Booking Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Booking Requests</CardTitle>
            <Link to="/dashboard/booking-request">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                View All
              </Badge>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No booking requests yet
                </p>
              ) : (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 border transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{booking.user.name}</p>
                      <p className="text-xs text-gray-600">{booking.room.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(booking.bookedAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-sm">
                        Rs. {booking.room.price}
                      </p>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Your Rooms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Your Rooms</CardTitle>
            <Link to="/dashboard/myrooms">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Manage
              </Badge>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myRooms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No rooms listed yet</p>
                  <Link to="/dashboard/addroom">
                    <Badge className="bg-accent hover:bg-orange-500 cursor-pointer">
                      Add Your First Room
                    </Badge>
                  </Link>
                </div>
              ) : (
                myRooms.slice(0, 5).map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 border transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={room.images[0] || '/placeholder.svg'}
                        alt={room.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{room.title}</p>
                        <p className="text-xs text-gray-600">
                          Rs. {room.price}/month
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        room.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {room.available ? 'Available' : 'Booked'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
            <div className="p-4 border border-yellow-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
            </div>
            <div className="p-4 border border-green-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{acceptedBookings}</p>
            </div>
            <div className="p-4 border border-blue-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{completedBookings}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/dashboard/addroom">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-center">
                <Home className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="font-medium">Add New Room</p>
                <p className="text-xs text-gray-500 mt-1">List a new property</p>
              </div>
            </Link>
            <Link to="/dashboard/booking-request">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="font-medium">View Requests</p>
                <p className="text-xs text-gray-500 mt-1">
                  {pendingBookings} pending
                </p>
              </div>
            </Link>
            <Link to="/dashboard/myrooms">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="font-medium">Manage Rooms</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalRooms} total rooms
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
