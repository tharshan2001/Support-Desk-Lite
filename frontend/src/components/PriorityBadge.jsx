import React from "react";

const PriorityBadge = ({ priority }) => {
  const config = {
    low: {
      bg: "#d1fae5",
      color: "#065f46",
      label: "Low",
    },
    medium: {
      bg: "#fef3c7",
      color: "#b45309",
      label: "Medium",
    },
    high: {
      bg: "#fee2e2",
      color: "#991b1b",
      label: "High",
    },
  };

  const c = config[priority] || config.low;

  return (
    <span
      className="badge"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
};

export default PriorityBadge;
