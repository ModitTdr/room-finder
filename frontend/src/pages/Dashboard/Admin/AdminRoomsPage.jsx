import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingPage from "@/pages/LoadingPage";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 10;

const AdminRoomsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all rooms
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["admin-all-rooms"],
    queryFn: async () => {
      const response = await axios.get(`${API}/rooms`, {
        withCredentials: true
      });
      return response.data;
    },
  });

  // Toggle availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (roomId) => {
      const response = await axios.patch(
        `${API}/admin/rooms/${roomId}/toggle-availability`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['admin-all-rooms']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to toggle availability');
    }
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId) => {
      const response = await axios.delete(
        `${API}/admin/rooms/${roomId}`,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Room deleted successfully');
      queryClient.invalidateQueries(['admin-all-rooms']);
      setDeleteDialogOpen(false);
      setSelectedRoom(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  const allRooms = rooms || [];

  // Calculate stats
  const totalRooms = allRooms.length;
  const availableRooms = allRooms.filter(r => r.available).length;
  const bookedRooms = totalRooms - availableRooms;
  const roomsByType = allRooms.reduce((acc, room) => {
    acc[room.roomType] = (acc[room.roomType] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      title: "Total Rooms",
      value: totalRooms,
      icon: Home,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Available",
      value: availableRooms,
      icon: CheckCircle,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Booked",
      value: bookedRooms,
      icon: XCircle,
      color: "bg-red-500",
      lightColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Total Revenue Potential",
      value: `Rs. ${allRooms.filter(r => r.available).reduce((sum, r) => sum + r.price, 0).toLocaleString()}`,
      icon: Eye,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  // Filter data
  const filteredData = allRooms.filter((room) => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "AVAILABLE" && room.available) ||
      (statusFilter === "BOOKED" && !room.available);
    const matchesType = typeFilter === "ALL" || room.roomType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    if (filterType === "status") setStatusFilter(value);
    if (filterType === "type") setTypeFilter(value);
  };

  const handleToggleAvailability = (room) => {
    toggleAvailabilityMutation.mutate(room.id);
  };

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRoom) {
      deleteRoomMutation.mutate(selectedRoom.id);
    }
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
          <h1 className="text-2xl md:text-3xl font-bold">Room Management</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Monitor and manage all listed rooms
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-xl shadow-sm border border-gray-600 p-6 hover:shadow-md transition-shadow"
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

        {/* Rooms by Type */}
        <div className="rounded-xl shadow-sm border border-gray-600 p-6">
          <h3 className="text-lg font-semibold mb-4">Rooms by Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(roomsByType).map(([type, count]) => (
              <div key={type} className="p-3 bg-neutral-900 rounded-lg text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-400">{type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rooms Table */}
        <div className="rounded-xl shadow-sm border border-foreground/30 overflow-hidden">
          <div className="p-6 border-b border-foreground/40">
            <h2 className="text-xl font-semibold">All Rooms</h2>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all room listings
            </p>
          </div>

          {/* Filters */}
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or address..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BOOKED">Booked</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select
                value={typeFilter}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="DOUBLE">Double</SelectItem>
                  <SelectItem value="FLAT">Flat</SelectItem>
                  <SelectItem value="APARTMENT">Apartment</SelectItem>
                  <SelectItem value="HOSTEL">Hostel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {paginatedData.length} of {filteredData.length} rooms
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-background">
                  <TableHead className="font-semibold text-gray-400">Room</TableHead>
                  <TableHead className="font-semibold text-gray-400">Type</TableHead>
                  <TableHead className="font-semibold text-gray-400">Price</TableHead>
                  <TableHead className="font-semibold text-gray-400">Owner</TableHead>
                  <TableHead className="font-semibold text-gray-400">Status</TableHead>
                  <TableHead className="font-semibold text-gray-400">Listed</TableHead>
                  <TableHead className="font-semibold text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      No rooms found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((room) => (
                    <TableRow key={room.id} className="hover:bg-neutral-500/5">
                      <TableCell className="min-w-[200px]">
                        <div className="flex items-center space-x-3">
                          <img
                            src={room.images[0] || '/placeholder.svg'}
                            alt={room.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{room.title}</p>
                            <p className="text-xs text-gray-400">
                              {room.address.substring(0, 30)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{room.roomType}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        Rs. {room.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        Owner ID: {room.ownerId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            room.available
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }
                        >
                          {room.available ? 'Available' : 'Booked'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(room.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAvailability(room)}
                            disabled={toggleAvailabilityMutation.isLoading}
                            title={room.available ? 'Mark as Unavailable' : 'Mark as Available'}
                          >
                            {room.available ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/rooms/${room.id}`, '_blank')}
                            title="View Room"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(room)}
                            disabled={deleteRoomMutation.isLoading}
                            title="Delete Room"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-foreground/40">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedRoom?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteRoomMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteRoomMutation.isLoading}
            >
              {deleteRoomMutation.isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRoomsPage;
