const TicketHeader = ({ ticket, onStatusUpdate, updating }) => {
  if (!ticket) return null;

  const statusStyles = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-start shrink-0">
      <div className="space-y-4 max-w-4xl flex-1">
        {/* Title and Status Row */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {ticket.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[ticket.status] || statusStyles.closed}`}>
            {ticket.status}
          </span>
        </div>

        {/* Description Section */}
        {ticket.description && (
          <div className="bg-slate-50/80 border-l-2 border-slate-200 p-3 rounded-r-lg">
            <p className="text-sm text-slate-600 leading-relaxed">
              {ticket.description}
            </p>
          </div>
        )}

        {/* Metadata Row */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <p>Priority: <span className="font-bold text-slate-700 uppercase tracking-tighter">{ticket.priority}</span></p>
          <span className="text-slate-300">|</span>
          <p>Created by: <span className="font-medium text-slate-700">{ticket.createdBy?.name}</span></p>
          {ticket.tags?.length > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <div className="flex gap-1.5">
                {ticket.tags.map(tag => (
                  <span key={tag} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] text-slate-500 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      {onStatusUpdate && (
        <div className="ml-8 pt-1">
          <button 
            onClick={onStatusUpdate} 
            disabled={updating}
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200 disabled:opacity-50 active:scale-95 whitespace-nowrap"
          >
            {updating ? "Processing..." : "Update Status"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketHeader;