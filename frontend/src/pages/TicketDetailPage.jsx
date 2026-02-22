import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTicketById, getComments, addComment } from "../service/tickets";

/* ---------- TICKET DATE FORMATTER (ONLY FOR TICKET) ---------- */
const formatTicketDate = (date) => {
  const now = new Date();
  const created = new Date(date);
  const diffMs = now - created;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // After 2 days → "May 10"
  if (diffDays >= 2) {
    return created.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours >= 1) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  if (minutes >= 1) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  return "just now";
};
/* ------------------------------------------------------------ */

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
          getComments(ticketId),
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
        user: { name: "You" },
      };
      await addComment({ ticketId, body: commentText });
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (err) {
      alert("Failed to post.");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Refining your view...
      </div>
    );

  if (!ticket) return <div className="p-10 text-center">Ticket not found.</div>;

  return (
    <div className="max-w-4xl mx-auto h-[92vh] mt-4 flex flex-col rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-50 flex items-center justify-between backdrop-blur-md relative">
        <div className="flex items-center gap-2">
          <span
            className={`absolute top-4 left-5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${
              statusStyles[ticket.status] || statusStyles.closed
            }`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      {/* TICKET BODY */}
      <div className="shrink-0 p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-3xl font-normal text-slate-700 leading-tight tracking-normal camelcase">
            {ticket.title}
          </p>
          <span className="absolute right-70 text-slate-500 text-xs z-20 mt-3 font-black">
            {formatTicketDate(ticket.createdAt)}
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed text-[13px] mb-6 max-w-3xl">
          {ticket.description}
        </p>
      </div>

      {/* COMMENTS */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {comments.map((c, idx) => (
          <div key={idx} className="flex gap-4 group w-150">
            <div className="w-8 h-8 rounded-full border border-slate-200 shrink-0 flex items-center justify-center text-[11px] font-bold text-slate-400 shadow-sm">
              {c.user?.name?.[0]}
            </div>
            <div className="flex-1">
              <div className="bg-blue-500/10 p-3 rounded-3xl rounded-tl-none border border-slate-100/10 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {c.user?.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(c.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-slate-600 text-[14px] leading-relaxed">
                  {c.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="shrink-0 p-4 border-t border-slate-100">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your response..."
            className="w-full bg-slate-100 border-none rounded-2xl py-3 px-5 pr-20 text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none outline-none"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            className="absolute right-2 bg-blue-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-600 disabled:opacity-90 shadow-lg shadow-indigo-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;