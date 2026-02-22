// src/components/admin/NotesColumn.jsx
import { useEffect, useRef } from "react";

const NotesColumn = ({ notes, value, onChange, onAdd }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current &&
      (ref.current.scrollTop = ref.current.scrollHeight);
  }, [notes]);

  return (
    <div className="w-[360px] border-l flex flex-col bg-white">
      <div className="p-4 border-b bg-slate-50">
        <h3 className="text-xs font-black uppercase tracking-widest">
          Internal Notes
        </h3>
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.map((n, i) => (
          <div key={i} className="bg-slate-50 p-3 rounded-xl border">
            <span className="text-xs font-bold">{n.user?.name}</span>
            <p className="text-xs text-slate-600 mt-1">{n.body}</p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add internal note…"
          className="w-full bg-slate-100 rounded-xl p-2 text-xs"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <button
          onClick={onAdd}
          className="mt-2 w-full bg-slate-800 text-white py-1.5 rounded-lg text-xs font-bold"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NotesColumn;