// components/TicketCard.jsx
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import { formatDistanceToNow } from "date-fns";

const TicketCard = ({ ticket }) => {
  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <Link
      to={`/tickets/detailed/${ticket._id}`}
      className="group block bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-150 shadow-sm hover:shadow"
      aria-label={`View ticket ${ticket.title}`}
    >
      <div className="p-2">
        {/* Top Row: Reporter */}
        <div className="flex items-center gap-2 mb-1 text-[9px] text-gray-500 ml-2">
          <div className="w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold text-[9px]">
            {ticket.createdBy?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span className="text-[9px]">
            {ticket.createdBy?.name || "Anonymous"}
          </span>
        </div>

        {/* Title + Badges */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-[20px] ml-9 text-gray-900 truncate group-hover:text-green-700">
            {ticket.title}
          </p>
          <div className="flex items-center gap-1 text-[8px]">
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] ml-10 text-gray-600 line-clamp-2 leading-snug">
          {ticket.description}
        </p>
      </div>

      <div className="flex justify-end px-2 pb-1">
        <span className="flex items-center gap-0.5 text-[8px] text-gray-500">
          <Calendar size={10} className="text-gray-400" />
          <time dateTime={ticket.createdAt}>
            {getTimeAgo(ticket.createdAt)}
          </time>
        </span>
      </div>
    </Link>
  );
};

export default TicketCard;
