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

  const getNextStatus = (status) =>
    ALLOWED_STATUS_TRANSITIONS[status]?.[0];

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

  if (!ticket) return null;

  return (
    <div className="max-w-7xl mx-auto mt-4 h-[92vh] flex flex-col bg-white rounded-2xl shadow border overflow-hidden">
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
        <CommentsColumn
          comments={comments}
          value={commentText}
          onChange={setCommentText}
          onSend={async () => {
            await addComment({ ticketId, body: commentText });
            setComments((p) => [
              ...p,
              { body: commentText, createdAt: new Date(), user: { name: "Admin" } },
            ]);
            setCommentText("");
          }}
        />

        <NotesColumn
          notes={notes}
          value={noteText}
          onChange={setNoteText}
          onAdd={async () => {
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
  );
};

export default AdminTicketDetailPage;