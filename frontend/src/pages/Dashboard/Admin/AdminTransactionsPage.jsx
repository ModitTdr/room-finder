import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import LoadingPage from "../../LoadingPage";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 10;

const AdminTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["alltransactions"],
    queryFn: async () => {
      const response = await axios.get(`${API}/admin/transactions`, {
        withCredentials: true
      });
      return response.data;
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  const allTransactions = transactions || [];

  // Calculate stats
  const totalTransactions = allTransactions.length;
  const completedTransactions = allTransactions.filter(t => t.status === 'COMPLETED').length;
  const pendingTransactions = allTransactions.filter(t => t.status === 'PENDING').length;
  const failedTransactions = allTransactions.filter(t => t.status === 'FAILED').length;
  const totalRevenue = allTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Completed",
      value: completedTransactions,
      icon: CheckCircle,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Pending",
      value: pendingTransactions,
      icon: Clock,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      title: "Failed",
      value: failedTransactions,
      icon: XCircle,
      color: "bg-red-500",
      lightColor: "bg-red-50",
      textColor: "text-red-600"
    }
  ];

  // Filter data
  const filteredData = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.booking?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.booking?.room?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.esewaTransactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    if (filterType === "status") setStatusFilter(value);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      FAILED: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      REFUNDED: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen text-foreground bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">Transaction Management</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Monitor all payment transactions and revenue
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

        {/* Transactions Table */}
        <div className="rounded-xl shadow-sm border border-foreground/30 overflow-hidden">
          <div className="p-6 border-b border-foreground/40">
            <h2 className="text-xl font-semibold">All Transactions</h2>
            <p className="text-sm text-gray-600 mt-1">
              View and monitor all payment transactions
            </p>
          </div>

          {/* Filters */}
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user, room, or transaction ID..."
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
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {paginatedData.length} of {filteredData.length} transactions
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-background">
                  <TableHead className="font-semibold text-gray-400">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-400">User</TableHead>
                  <TableHead className="font-semibold text-gray-400">Room</TableHead>
                  <TableHead className="font-semibold text-gray-400">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-400">Status</TableHead>
                  <TableHead className="font-semibold text-gray-400">Date</TableHead>
                  <TableHead className="font-semibold text-gray-400">eSewa ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      No transactions found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-neutral-500/5">
                      <TableCell className="font-mono text-xs">
                        {transaction.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <div>
                          <p className="font-medium">{transaction.booking?.user?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{transaction.booking?.user?.email || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        {transaction.booking?.room?.title || 'N/A'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        Rs. {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="min-w-[150px] text-sm">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {transaction.esewaTransactionId || 'N/A'}
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
    </div>
  );
};

export default AdminTransactionsPage;
