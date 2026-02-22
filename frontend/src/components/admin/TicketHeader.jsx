const TicketHeader = ({ ticket, onStatusUpdate, updating }) => {
  if (!ticket) return null;

  const statusStyles = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {ticket.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[ticket.status] || statusStyles.closed}`}>
            {ticket.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <p>Priority: <span className="font-bold text-slate-700 uppercase">{ticket.priority}</span></p>
          <span className="text-slate-300">|</span>
          <p>Created by: <span className="font-medium text-slate-700">{ticket.createdBy?.name}</span></p>
          {ticket.tags?.length > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <div className="flex gap-1">
                {ticket.tags.map(tag => (
                  <span key={tag} className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-400">#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {onStatusUpdate && (
        <button 
          onClick={onStatusUpdate} 
          disabled={updating}
          className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          {updating ? "Processing..." : "Update Status"}
        </button>
      )}
    </div>
  );
};

export default TicketHeader;