import React from "react";

const StatusBadge = ({ status }) => {
  const config = {
    open: {
      bg: "#dbeafe",
      color: "#1d4ed8",
      label: "Open",
    },
    in_progress: {
      bg: "#fef3c7",
      color: "#b45309",
      label: "In Progress",
    },
    resolved: {
      bg: "#d1fae5",
      color: "#065f46",
      label: "Resolved",
    },
    closed: {
      bg: "#f3f4f6",
      color: "#6b7280",
      label: "Closed",
    },
  };

  const c = config[status] || config.open;

  return (
    <span
      className="badge"
      style={{ background: c.bg, color: c.color }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c.color,
          display: "inline-block",
        }}
      />
      {c.label}
    </span>
  );
};

export default StatusBadge;
