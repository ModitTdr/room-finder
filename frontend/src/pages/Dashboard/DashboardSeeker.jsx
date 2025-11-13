import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Heart,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import { useAuth } from "@/hooks/useAuth";

const API = import.meta.env.VITE_API_URL;
const APP = import.meta.env.VITE_APP_URL;

const SeekerDashboard = () => {
  const { user } = useAuth();

  // Fetch user's bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await axios.get(`${API}/bookings/my-bookings`, {
        withCredentials: true
      });
      return response.data;
    },
  });

  // Fetch recommended rooms
  const { data: recommendedRooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["recommended-rooms"],
    queryFn: async () => {
      const response = await axios.get(`${APP}/recommendation/${user?.id}`, {
        withCredentials: true
      });
      return response.data.rooms || [];
    },
    enabled: !!user?.id,
  });

  if (bookingsLoading || roomsLoading) {
    return <LoadingPage />;
  }

  const myBookings = bookings || [];
  const rooms = recommendedRooms || [];

  // Calculate stats
  const totalBookings = myBookings.length;
  const pendingBookings = myBookings.filter(b => b.status === 'PENDING').length;
  const acceptedBookings = myBookings.filter(b => b.status === 'ACCEPTED').length;
  const completedBookings = myBookings.filter(b => b.status === 'COMPLETED').length;
  const rejectedBookings = myBookings.filter(b => b.status === 'REJECTED').length;

  // Calculate total spent
  const totalSpent = myBookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.room.price, 0);

  // Recent bookings
  const recentBookings = [...myBookings]
    .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    .slice(0, 3);

  const mainStats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: `${completedBookings} completed`
    },
    {
      title: "Pending Requests",
      value: pendingBookings,
      icon: Clock,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      description: "Awaiting response"
    },
    {
      title: "Accepted Bookings",
      value: acceptedBookings,
      icon: CheckCircle,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Ready to pay"
    },
    {
      title: "Total Spent",
      value: `Rs. ${totalSpent.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: "On bookings"
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
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">
          Find your perfect room and manage your bookings
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
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <Link to="/dashboard/bookings">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                View All
              </Badge>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No bookings yet</p>
                  <Link to="/rooms">
                    <Badge className="bg-accent hover:bg-orange-500 cursor-pointer">
                      Browse Rooms
                    </Badge>
                  </Link>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-foreground/5 transition-colors"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <img
                        src={booking.room.images[0] || '/placeholder.svg'}
                        alt={booking.room.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{booking.room.title}</p>
                        <div className="flex items-center text-xs text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.room.address.substring(0, 30)}...
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(booking.bookedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
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

        {/* Recommended Rooms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recommended For You</CardTitle>
            <Link to="/rooms">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                View More
              </Badge>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rooms.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Complete your profile to get recommendations
                </p>
              ) : (
                rooms.slice(0, 3).map((room) => (
                  <Link key={room.id} to={`/rooms/${room.id}`}>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer">
                      <img
                        src={room.images[0] || '/placeholder.svg'}
                        alt={room.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{room.title}</p>
                        <div className="flex items-center text-xs text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {room.address.substring(0, 30)}...
                        </div>
                        <p className="text-sm font-semibold text-accent mt-1">
                          Rs. {room.price}/month
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {room.roomType}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-yellow-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
            <div className="p-4 border border-green-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{acceptedBookings}</p>
              <p className="text-xs text-gray-500 mt-1">Ready to pay</p>
            </div>
            <div className="p-4 border border-blue-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Home className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{completedBookings}</p>
              <p className="text-xs text-gray-500 mt-1">Paid & confirmed</p>
            </div>
            <div className="p-4 border border-red-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{rejectedBookings}</p>
              <p className="text-xs text-gray-500 mt-1">Not approved</p>
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
            <Link to="/rooms">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-center">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="font-medium">Browse Rooms</p>
                <p className="text-xs text-gray-500 mt-1">Find your perfect place</p>
              </div>
            </Link>
            <Link to="/dashboard/bookings">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="font-medium">My Bookings</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalBookings} total bookings
                </p>
              </div>
            </Link>
            <Link to="/dashboard/userprofile">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="font-medium">Update Profile</p>
                <p className="text-xs text-gray-500 mt-1">Get better recommendations</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerDashboard;
