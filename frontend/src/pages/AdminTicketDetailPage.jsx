import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TicketHeader from "../components/admin/TicketHeader";
import CommentsColumn from "../components/admin/CommentsColumn";
import NotesColumn from "../components/admin/NotesColumn";

import { getTicketById, getComments, addComment } from "../service/tickets";
import { getInternalNotes, addInternalNote } from "../service/notes";
import { updateTicketStatus } from "../service/status";
import { ALLOWED_STATUS_TRANSITIONS } from "../utils/statusTransitions";

const AdminTicketDetailPage = () => {
  const { id: ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [updating, setUpdating] = useState(false);

  const getNextStatus = (status) => ALLOWED_STATUS_TRANSITIONS[status]?.[0];

  useEffect(() => {
    Promise.all([
      getTicketById(ticketId),
      getComments(ticketId),
      getInternalNotes(ticketId),
    ]).then(([t, c, n]) => {
      setTicket(t);
      setComments(c ?? []);
      setNotes(n?.data ?? []);
    });
  }, [ticketId]);

  if (!ticket) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Loading ticket details...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <TicketHeader
        ticket={ticket}
        updating={updating}
        onStatusUpdate={async () => {
          const next = getNextStatus(ticket.status);
          if (!next) return;
          setUpdating(true);
          await updateTicketStatus({ id: ticket._id, status: next });
          setTicket((p) => ({ ...p, status: next }));
          setUpdating(false);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Public Thread - 60% or flexible */}
        <div className="flex-1 overflow-hidden">
          <CommentsColumn
            comments={comments}
            value={commentText}
            onChange={setCommentText}
            onSend={async () => {
              if (!commentText.trim()) return;
              await addComment({ ticketId, body: commentText });
              setComments((p) => [
                ...p,
                { body: commentText, createdAt: new Date(), user: { name: "Admin" } },
              ]);
              setCommentText("");
            }}
          />
        </div>

        {/* Internal Notes - 40% or fixed width */}
        <div className="w-96 overflow-hidden">
          <NotesColumn
            notes={notes}
            value={noteText}
            onChange={setNoteText}
            onAdd={async () => {
              if (!noteText.trim()) return;
              await addInternalNote({ ticketId, body: noteText });
              setNotes((p) => [
                ...p,
                { body: noteText, createdAt: new Date(), user: { name: "Admin" } },
              ]);
              setNoteText("");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetailPage;