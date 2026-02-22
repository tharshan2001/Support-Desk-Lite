// src/components/admin/CommentsColumn.jsx
import { useEffect, useRef } from "react";

const CommentsColumn = ({ comments, value, onChange, onSend }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current &&
      (ref.current.scrollTop = ref.current.scrollHeight);
  }, [comments]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50">
      <div ref={ref} className="flex-1 overflow-y-auto p-6 space-y-6">
        {comments.map((c, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-xs font-bold">
              {c.user?.name?.[0]}
            </div>

            <div className="bg-white p-4 rounded-2xl border flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold">{c.user?.name}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-slate-600">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Reply as admin…"
          className="w-full bg-slate-100 rounded-xl p-3 text-sm"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
      </div>
    </div>
  );
};

export default CommentsColumn;