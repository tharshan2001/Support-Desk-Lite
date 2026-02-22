// src/components/admin/TicketHeader.jsx
const statusStyles = {
  open: "bg-emerald-100 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  resolved: "bg-amber-100 text-amber-700 border-amber-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const TicketHeader = ({ ticket, onStatusUpdate, updating }) => {
  if (!ticket) return null;

  return (
    <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${
            statusStyles[ticket.status] || statusStyles.closed
          }`}
        >
          ● {ticket.status}
        </span>

        <span className="text-xs text-slate-500">
          ID: {ticket._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {onStatusUpdate && (
        <button
          onClick={onStatusUpdate}
          disabled={updating}
          className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white disabled:opacity-40"
        >
          {updating ? "Updating…" : "Update Status"}
        </button>
      )}
    </div>
  );
};

export default TicketHeader;