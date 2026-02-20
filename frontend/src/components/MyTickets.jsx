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
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Inbox</h2>
          <p className="text-[11px] text-slate-400 mt-1">Manage your active support requests</p>
        </div>
        <button onClick={() => navigate("/tickets/new")} className="text-[11px] font-bold text-slate-900 hover:opacity-70 transition-opacity">
          + NEW ISSUE
        </button>
      </div>

      {loading ? (
        <div className="text-[11px] text-slate-400 uppercase tracking-widest text-center py-20">Syncing...</div>
      ) : (
        <div className="space-y-px bg-slate-200 border border-slate-200 rounded-sm overflow-hidden">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => navigate(`/tickets/details/${ticket._id}`)}
              className="group bg-white flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1 truncate">
                {/* Minimal Priority Dot */}
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ticket.priority === 'high' ? 'bg-red-400' : 'bg-slate-300'}`} />
                
                <div className="truncate pr-4">
                  <h3 className="text-xs font-medium text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                    {ticket.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <span className="hidden sm:inline text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                  {ticket.status}
                </span>
                <span className="text-[10px] text-slate-400 w-16 text-right">
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;