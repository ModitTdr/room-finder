import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Check, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserByAdmin } from "@/services/userServices.js";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const tableHead = [
  { title: "Name" },
  { title: "Email" },
  { title: "Phone" },
  { title: "Role" },
  { title: "Status" },
  { title: "Request" },
];

const ITEMS_PER_PAGE = 10;

const UserListTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUserByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["allusers"]);
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleRole = (value, id) => {
    mutation.mutate({ role: value, id: id });
  };

  // Filter data
  const filteredData = data.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "APPROVED" && user.requestedOwnerRole === "APPROVED") ||
      (statusFilter === "PENDING" && user.requestedOwnerRole === "PENDING")
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRequestStatus = (request) => {
    if (request === "PENDING") {
      return "Pending";
    } else if (request === "APPROVED") {
      return "APPROVED";
    } else if (request === "REJECTED") {
      return "Rejected";
    }
  }
  const getRequestStyle = (request) => {
    if (request === "PENDING") {
      return "bg-yellow-100 text-yellow-700";
    } else if (request === "APPROVED") {
      return "bg-green-100 text-green-700";
    } else if (request === "REJECTED") {
      return "bg-red-100 text-red-700";
    }
    if (request == null) return "text-gray-700";
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    if (filterType === "role") setRoleFilter(value);
    if (filterType === "status") setStatusFilter(value);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(value) => handleFilterChange("role", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="SEEKER">Seeker</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredData.length} users
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-background">
              {tableHead.map((head) => (
                <TableHead
                  key={head.title}
                  className="font-semibold text-gray-400"
                >
                  {head.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHead.length}
                  className="text-center py-12 text-gray-500"
                >
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((user) => {
                const { id, name, email, role, profile, isVerified, requestedOwnerRole } = user;
                return (
                  <TableRow key={id} className="hover:bg-neutral-500/5">
                    <TableCell className="font-medium min-w-[120px]">
                      {name}
                    </TableCell>
                    <TableCell className="min-w-[200px] ">
                      {email}
                    </TableCell>
                    <TableCell className="min-w-[120px] ">
                      {profile?.phone || (
                        <span className="text-gray-200 italic">
                          Not Available
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <Select
                        value={role}
                        onValueChange={(value) => handleRole(value, id)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OWNER">OWNER</SelectItem>
                          <SelectItem value="SEEKER">SEEKER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {isVerified ? (
                          <>
                            <Check size={14} />
                            Verified
                          </>
                        ) : (
                          <>
                            <X size={14} />
                            Unverified
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getRequestStyle(requestedOwnerRole)}`}
                      >
                        {requestedOwnerRole !== null ? (
                          <>{getRequestStatus(requestedOwnerRole)}</>
                        ) : (
                          <>No Request</>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListTable;
