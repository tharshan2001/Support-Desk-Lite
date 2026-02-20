// components/PriorityBadge.jsx
import React from "react";

const PriorityBadge = ({ priority }) => {
  const config = {
    low: { bg: "bg-green-100", color: "text-green-700", label: "Low" },
    medium: { bg: "bg-amber-100", color: "text-amber-700", label: "Medium" },
    high: { bg: "bg-red-100", color: "text-red-700", label: "High" },
  };

  const c = config[priority] || config.low;

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${c.bg} ${c.color}`}>
      {c.label}
    </span>
  );
};

export default PriorityBadge;