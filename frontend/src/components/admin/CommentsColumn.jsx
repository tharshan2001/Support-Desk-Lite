import { useEffect, useRef } from "react";

const CommentsColumn = ({ comments, value, onChange, onSend }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [comments]);

  return (
    <div className="flex flex-col h-full bg-blue-50/30 border-r border-slate-100">
      <div className="p-4 border-b border-blue-100/50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
        <p className="text-[18px] font-black text-blue-700 uppercase tracking-widest">Public Thread</p>
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map((c, i) => (
          <div key={i} className="bg-white border border-blue-100/60 p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {c.user?.name?.[0]}
                </div>
                <span className="text-[12px] font-bold text-slate-800">
                  {c.user?.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {c.body}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/50 border-t border-blue-100/50 shrink-0">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Send a public response..."
          className="w-full bg-white border border-blue-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none mb-2 shadow-inner"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button 
          onClick={onSend}
          disabled={!value.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
        >
          Send Response
        </button>
      </div>
    </div>
  );
};

export default CommentsColumn;