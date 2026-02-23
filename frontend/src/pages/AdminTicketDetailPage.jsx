import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayCircle, CheckCircle, XCircle } from "lucide-react";

import TicketHeader from "../components/admin/TicketHeader";
import CommentsColumn from "../components/admin/CommentsColumn";
import NotesColumn from "../components/admin/NotesColumn";

import { getTicketById, getComments, addComment } from "../service/tickets";
import { getInternalNotes, addInternalNote } from "../service/notes";
import { updateTicketStatus } from "../service/status";
import { ALLOWED_STATUS_TRANSITIONS } from "../utils/statusTransitions";

import toast from "react-hot-toast";

const STATUS_UI = {
  in_progress: {
    label: "In Progress",
    icon: PlayCircle,
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
  },
  closed: {
    label: "Close",
    icon: XCircle,
  },
};

const AdminTicketDetailPage = () => {
  const { id: ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [t, c, n] = await Promise.all([
          getTicketById(ticketId),
          getComments(ticketId),
          getInternalNotes(ticketId),
        ]);

        setTicket(t);
        setComments(c ?? []);
        setNotes(n?.data ?? []);
      } catch (err) {
        toast.error("Failed to load ticket details");
      }
    };

    loadData();
  }, [ticketId]);

  const handleStatusChange = async (nextStatus) => {
    if (updating) return;

    setUpdating(true);
    const toastId = toast.loading("Updating ticket status...");

    try {
      await updateTicketStatus({ id: ticket._id, status: nextStatus });
      setTicket((prev) => ({ ...prev, status: nextStatus }));
      toast.success("Ticket status updated", { id: toastId });
    } catch (err) {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (!ticket) {
    return (
      <div className="h-[600px] flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Loading ticket details...
      </div>
    );
  }

  const nextStatuses = ALLOWED_STATUS_TRANSITIONS[ticket.status] || [];

  return (
    <div className="flex flex-col h-[800px] bg-white overflow-hidden">
      {/* HEADER */}
      <TicketHeader ticket={ticket} />

      {/* STATUS ACTION BUTTONS */}
      {nextStatuses.length > 0 && (
        <div className="flex gap-6 px-6 py-3 border-b">
          {nextStatuses.map((next) => {
            const Icon = STATUS_UI[next]?.icon;
            const label = STATUS_UI[next]?.label ?? next;

            return (
              <button
                key={next}
                disabled={updating}
                onClick={() => handleStatusChange(next)}
                className="flex flex-col items-center text-slate-600 hover:text-black disabled:opacity-40"
              >
                <Icon size={26} />
                <span className="text-xs mt-1">{label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Public Comments */}
        <div className="flex-1 overflow-hidden">
          <CommentsColumn
            comments={comments}
            value={commentText}
            onChange={setCommentText}
            onSend={async () => {
              if (!commentText.trim()) return;

              try {
                await addComment({ ticketId, body: commentText });
                setComments((prev) => [
                  ...prev,
                  {
                    body: commentText,
                    createdAt: new Date(),
                    user: { name: "Admin" },
                  },
                ]);
                setCommentText("");
                toast.success("Comment added");
              } catch (err) {
                toast.error("Failed to add comment");
              }
            }}
          />
        </div>

        {/* Internal Notes */}
        <div className="w-96 overflow-hidden">
          <NotesColumn
            notes={notes}
            value={noteText}
            onChange={setNoteText}
            onAdd={async () => {
              if (!noteText.trim()) return;

              try {
                await addInternalNote({ ticketId, body: noteText });
                setNotes((prev) => [
                  ...prev,
                  {
                    body: noteText,
                    createdAt: new Date(),
                    user: { name: "Admin" },
                  },
                ]);
                setNoteText("");
                toast.success("Internal note added");
              } catch (err) {
                toast.error("Failed to add note");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetailPage;