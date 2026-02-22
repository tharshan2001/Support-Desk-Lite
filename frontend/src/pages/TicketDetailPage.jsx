import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTicketById, getComments, addComment } from "../service/tickets";

const TicketDetailPage = () => {
  const { id: ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const scrollRef = useRef(null);

  // Status Style Mapper
  const statusStyles = {
    open: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    high: "bg-red-50 text-red-600 border-red-100",
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [ticketData, commentsData] = await Promise.all([
          getTicketById(ticketId),
          getComments(ticketId)
        ]);
        setTicket(ticketData);
        setComments(commentsData ?? []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [ticketId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = { 
        body: commentText, 
        createdAt: new Date().toISOString(), 
        user: { name: "You" } 
      };
      await addComment({ ticketId, body: commentText });
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (err) {
      alert("Failed to post.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 animate-pulse font-medium">Refining your view...</div>;
  if (!ticket) return <div className="p-10 text-center">Ticket not found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white h-[92vh] mt-4 flex flex-col rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      
      <div className="shrink-0 px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${statusStyles[ticket.status] || statusStyles.closed}`}>
            ● {ticket.status}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-medium text-slate-500 underline underline-offset-4 decoration-slate-200">
            ID: {ticket._id.slice(-6).toUpperCase()}
          </span>
        </div>
        <div className="flex gap-2">
            {ticket.tags?.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded italic">#{tag}</span>
            ))}
        </div>
      </div>

      <div className="shrink-0 p-6 bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{ticket.title}</h1>

        </div>
        
        <p className="text-slate-600 leading-relaxed text-[15px] mb-6 max-w-2xl">
          {ticket.description}
        </p>

        <div className="flex items-center gap-4 text-sm border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold uppercase">
              {ticket.createdBy?.name[0]}
            </div>
            <span className="font-semibold text-slate-700">{ticket.createdBy?.name}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 text-xs">Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 3. COMMENT FEED (SCROLLABLE) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth"
      >
        <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discussion Thread</span>
            <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {comments.map((c, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shrink-0 flex items-center justify-center text-[11px] font-bold text-slate-400 shadow-sm">
              {c.user?.name?.[0]}
            </div>
            <div className="flex-1">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800">{c.user?.name}</span>
                  <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-slate-600 text-[14px] leading-relaxed">{c.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. INPUT FOOTER */}
      <div className="shrink-0 p-4 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your response..."
            className="w-full bg-slate-100 border-none rounded-2xl py-3 px-5 pr-20 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none outline-none"
            rows="1"
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); }}}
          />
          <button
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            className="absolute right-2 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-lg shadow-indigo-200"
          >
            Send
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2 italic">Press Enter to send, Shift + Enter for new line</p>
      </div>
    </div>
  );
};

export default TicketDetailPage;