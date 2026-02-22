import React, { useEffect, useState } from "react";
import { getAllTicketsAdmin } from "../service/tickets";
import TicketCard from "../components/TicketCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  X,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ITEMS_PER_PAGE = 10;

const AdminTicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTicketsAdmin();
      setTickets(res?.tickets ?? []);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const sortTickets = (ticketsToSort) => {
    const sorted = [...ticketsToSort];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "priority":
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return sorted.sort(
          (a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        );
      case "status":
        return sorted.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
      default:
        return sorted;
    }
  };

  const filtered = sortTickets(
    tickets.filter((t) => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        t.title?.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t._id?.toLowerCase().includes(searchLower) ||
        t.createdBy?.name?.toLowerCase().includes(searchLower);

      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    })
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      textClass: "text-gray-900",
      bgClass: "bg-gradient-to-br from-gray-50 to-gray-100",
      icon: HelpCircle,
      iconColor: "text-gray-600",
    },
    {
      label: "Open",
      value: tickets.filter((t) => t.status === "open").length,
      textClass: "text-blue-700",
      bgClass: "bg-gradient-to-br from-blue-50 to-blue-100",
      icon: AlertCircle,
      iconColor: "text-blue-600",
    },
    {
      label: "In Progress",
      value: tickets.filter((t) => t.status === "in_progress").length,
      textClass: "text-amber-700",
      bgClass: "bg-gradient-to-br from-amber-50 to-amber-100",
      icon: Clock,
      iconColor: "text-amber-600",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "closed").length,
      textClass: "text-green-700",
      bgClass: "bg-gradient-to-br from-green-50 to-green-100",
      icon: CheckCircle2,
      iconColor: "text-green-600",
    },
  ];

  if (loading) return <LoadingSpinner message="Loading support operations..." />;

  return (
    <div className="h-[820px] bg-gray-50/50 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-4 py-3">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bgClass} rounded-xl px-5 py-3 border border-gray-100 shadow-sm transition-transform hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-white/60 ${stat.iconColor}`}>
                      <stat.icon size={16} />
                    </div>
                    <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <div className={`text-2xl font-bold mt-1.5 ${stat.textClass}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 group">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search by ID, title, description, or reporter..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Search tickets"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                aria-expanded={showFilters}
              >
                <Filter size={18} />
                {showFilters ? "Hide Filters" : "Filters"}
              </button>

              {/* Desktop Filters */}
              <div className="hidden sm:flex items-center gap-3">
                {[
                  {
                    value: statusFilter,
                    setter: setStatusFilter,
                    options: [
                      { val: "all", label: "All Status" },
                      { val: "open", label: "Open" },
                      { val: "in_progress", label: "In Progress" },
                      { val: "closed", label: "Closed" },
                    ],
                  },
                  {
                    value: priorityFilter,
                    setter: setPriorityFilter,
                    options: [
                      { val: "all", label: "All Priorities" },
                      { val: "low", label: "Low" },
                      { val: "medium", label: "Medium" },
                      { val: "high", label: "High" },
                    ],
                  },
                  {
                    value: sortBy,
                    setter: setSortBy,
                    options: [
                      { val: "newest", label: "Newest First" },
                      { val: "oldest", label: "Oldest First" },
                      { val: "priority", label: "Highest Priority" },
                      { val: "status", label: "Status" },
                    ],
                  },
                ].map((select, idx) => (
                  <select
                    key={idx}
                    className="px-3.5 py-2.5 border border-gray-300 rounded-xl bg-white text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
                    value={select.value}
                    onChange={(e) => {
                      select.setter(e.target.value);
                      setPage(1);
                    }}
                  >
                    {select.options.map((opt) => (
                      <option key={opt.val} value={opt.val}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            {/* Mobile Expandable Filters */}
            {showFilters && (
              <div className="sm:hidden grid grid-cols-1 gap-3 pt-3 border-t border-gray-100 animate-in slide-in-from-top-2">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Highest Priority</option>
                  <option value="status">Status</option>
                </select>
              </div>
            )}

            {/* Meta Row: Results Count */}
            <div className="flex items-center justify-end text-sm mt-2 h-8">
              <div className="flex items-center gap-4 text-gray-500 font-medium">
                {(statusFilter !== "all" ||
                  priorityFilter !== "all" ||
                  searchTerm ||
                  sortBy !== "newest") && (
                  <button
                    onClick={clearFilters}
                    className="text-green-600 hover:text-green-800 hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
                <span>
                  Showing{" "}
                  <strong className="text-gray-900">{paginated.length}</strong> of{" "}
                  <strong className="text-gray-900">{filtered.length}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto sm:px-6 lg:px-8 py-5 overflow-auto">
        {paginated.length === 0 ? (
          <div className="rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Inbox size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-base">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "We couldn't find any tickets matching your current filters. Try adjusting your search criteria."
                : "Your queue is completely clear! There are no active support tickets in the system right now."}
            </p>
            {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md shadow-green-200 transition-all font-semibold active:scale-95"
              >
                <X size={18} />
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paginated.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>

      {/* Pagination Footer */}
      {filtered.length > 0 && (
        <footer className="sticky z-20 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-gray-500 order-2 sm:order-1">
              Page <span className="text-gray-900">{page}</span> of{" "}
              <span className="text-gray-900">{totalPages || 1}</span>
            </div>

            <nav
              className="flex items-center gap-2 order-1 sm:order-2"
              aria-label="Pagination"
            >
              <button
                className="p-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5 hidden sm:flex">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;

                  const isActive = page === pageNum;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      aria-current={isActive ? "page" : undefined}
                      className={`min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm ${
                        isActive
                          ? "bg-green-600 text-white border-transparent hover:bg-green-700"
                          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="p-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AdminTicketListPage;