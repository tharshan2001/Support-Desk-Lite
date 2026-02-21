import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTicketById, getComments, addComment } from "../service/tickets";
import { updateTicketStatus } from "../service/status";
import { ALLOWED_STATUS_TRANSITIONS } from "../utils/statusTransitions";

const AdminTicketDetailPage = () => {
  const { id: ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const scrollRef = useRef(null);

  const statusStyles = {
    open: "bg-emerald-100 text-emerald-700 border-emerald-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200",
    resolved: "bg-amber-100 text-amber-700 border-amber-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    high: "bg-red-50 text-red-600 border-red-100",
  };

  const getNextStatus = (currentStatus) => {
    const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus];
    if (!allowed || allowed.length === 0) return null;
    return allowed[0]; // single-step transition
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
        console.error("Failed to load ticket:", err);
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
      const optimisticComment = {
        body: commentText,
        createdAt: new Date().toISOString(),
        user: { name: "Admin" },
      };

      await addComment({ ticketId, body: commentText });
      setComments((prev) => [...prev, optimisticComment]);
      setCommentText("");
    } catch {
      alert("Failed to post comment");
    }
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(ticket.status);
    if (!nextStatus) return;

    try {
      setUpdatingStatus(true);

      await updateTicketStatus({
        id: ticket._id,
        status: nextStatus,
      });

      setTicket((prev) => ({
        ...prev,
        status: nextStatus,
      }));
    } catch {
      alert("Failed to update ticket status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Loading ticket details…
      </div>
    );
  }

  if (!ticket) {
    return <div className="p-10 text-center">Ticket not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white h-[92vh] mt-4 flex flex-col rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${
              statusStyles[ticket.status] || statusStyles.closed
            }`}
          >
            ● {ticket.status}
          </span>

          <span className="text-slate-300">|</span>

          <span className="text-xs font-medium text-slate-500 underline underline-offset-4 decoration-slate-200">
            ID: {ticket._id.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {ticket.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded italic"
            >
              #{tag}
            </span>
          ))}

          {getNextStatus(ticket.status) && (
            <button
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
              className="ml-2 px-3 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition shadow"
            >
              {updatingStatus
                ? "Updating…"
                : `Mark as ${getNextStatus(ticket.status)
                    .replace("_", " ")
                    .toUpperCase()}`}
            </button>
          )}
        </div>
      </div>

      {/* Ticket Info */}
      <div className="shrink-0 p-6 bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
            {ticket.title}
          </h1>

          <div
            className={`px-3 py-1 rounded-lg border text-xs font-bold ${
              statusStyles[ticket.priority]
            }`}
          >
            {ticket.priority.toUpperCase()} PRIORITY
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed text-[15px] mb-6 max-w-2xl">
          {ticket.description}
        </p>

        <div className="flex items-center gap-4 text-sm border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold uppercase">
              {ticket.createdBy?.name?.[0]}
            </div>
            <span className="font-semibold text-slate-700">
              {ticket.createdBy?.name}
            </span>
          </div>

          <span className="text-slate-300">•</span>

          <span className="text-slate-500 text-xs">
            Created {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Admin Discussion
          </span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {comments.map((c, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400">
              {c.user?.name?.[0]}
            </div>

            <div className="flex-1">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800">
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

      {/* Reply Box */}
      <div className="shrink-0 p-4 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Reply as admin…"
            className="w-full bg-slate-100 rounded-2xl py-3 px-5 pr-20 text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none outline-none"
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
            className="absolute right-2 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-30 shadow-lg shadow-indigo-200"
          >
            Send
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-2 italic">
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AdminTicketDetailPage;