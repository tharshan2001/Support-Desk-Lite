import { useEffect, useRef } from "react";

const NotesColumn = ({ notes, value, onChange, onAdd }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [notes]);

  return (
    <div className="flex flex-col h-full bg-amber-50/30">
      <div className="p-4 border-b border-amber-100/50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
        <p className="text-[18px] font-black text-amber-700 uppercase tracking-widest">Internal Notes</p>
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.map((n, i) => (
          <div key={i} className="bg-white border border-amber-100/60 p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-amber-800 opacity-70 uppercase tracking-tight">
                {n.user?.name}
              </span>
              <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">PRIVATE</span>
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "{n.body}"
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/50 border-t border-amber-100/50 shrink-0">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add a private staff note..."
          className="w-full bg-white border border-amber-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-amber-500/5 focus:border-amber-600/50 outline-none transition-all resize-none mb-2 shadow-inner"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <button 
          onClick={onAdd}
          disabled={!value.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:shadow-none"
        >
          Add Internal Note
        </button>
      </div>
    </div>
  );
};

export default NotesColumn;