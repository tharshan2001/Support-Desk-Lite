import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../service/tickets";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyTickets()
      .then((data) => setTickets(data?.tickets ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Syncing your inbox...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 flex flex-col overflow-hidden h-[800px]">
      {/* HEADER — STICKY */}
      <div className="shrink-0 px-6 py-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-semibold text-slate-800 leading-tight tracking-tight">
            Inbox
          </h2>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              My Active Requests
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm font-medium text-slate-500">
              {tickets.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* TICKETS LIST — SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            onClick={() => navigate(`/tickets/details/${ticket._id}`)}
            className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              {/* Title + Date */}
              <div className="flex justify-between items-baseline mb-1 gap-4">
                <span className="text-base font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {ticket.title}
                </span>
                <span className="text-sm font-medium text-slate-500 shrink-0 whitespace-nowrap">
                  {new Date(ticket.createdAt).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                    ? "Today"
                    : "Yesterday"}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-500 truncate mb-3 pr-4">
                {ticket.description || "No additional details provided..."}
              </p>

              {/* Status */}
              <div className="flex items-start">
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md tracking-wide">
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;