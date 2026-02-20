// components/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const config = {
    open: { bg: "bg-blue-100", color: "text-blue-700", label: "Open" },
    in_progress: { bg: "bg-amber-100", color: "text-amber-700", label: "In Progress" },
    resolved: { bg: "bg-green-100", color: "text-green-700", label: "Resolved" },
    closed: { bg: "bg-gray-100", color: "text-gray-500", label: "Closed" },
  };

  const c = config[status] || config.open;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${c.bg} ${c.color}`}>
      <span
        className={`w-2 h-2 rounded-full ${c.color} inline-block`}
      />
      {c.label}
    </span>
  );
};

export default StatusBadge;