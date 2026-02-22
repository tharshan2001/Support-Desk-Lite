import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../service/tickets";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyTickets().then(data => setTickets(data?.tickets ?? [])).finally(() => setLoading(false));
  }, []);



  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Inbox</h2>
          <p className="text-[11px] text-slate-400 mt-1">Manage your active support requests</p>
        </div>
        <button 
          onClick={() => navigate("/tickets/new")} 
          className="text-[11px] font-bold text-slate-900 hover:opacity-70 transition-opacity border border-slate-200 px-3 py-1 rounded"
        >
          + NEW ISSUE
        </button>
      </div>

      {loading ? (
        <div className="text-[11px] text-slate-400 uppercase tracking-widest text-center py-20 italic">Syncing...</div>
      ) : (
        <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => navigate(`/tickets/details/${ticket._id}`)}
              className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 flex-1 truncate">
                {/* Avatar Initial */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <span className="text-blue-400 font-semibold text-sm uppercase">
                    {ticket.title?.charAt(0) || 'T'}
                  </span>
                </div>

                {/* Content */}
                <div className="truncate pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[14px] font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {ticket.title}
                    </h3>
        
                  </div>
                  <p className="text-[13px] text-slate-400 truncate">
                    {ticket.description || "No additional details provided..."}
                  </p>
                </div>
              </div>

              {/* Meta Data (Right Side) */}
              <div className="text-right flex flex-col justify-between h-10 shrink-0 min-w-[100px]">
                <span className="text-[11px] text-slate-300 font-medium">
                  Ticket ID: #{ticket._id?.slice(-5).toUpperCase() || 'N/A'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Visual empty space to match your screenshot */}
          <div className="h-16 bg-white" />
        </div>
      )}
    </div>
  );
};

export default MyTickets;