import React from "react";
import {
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";

export const ALLOWED_STATUS_TRANSITIONS = {
  open: ["in_progress"],
  in_progress: ["resolved"],
  resolved: ["closed", "in_progress"],
  closed: [],
};

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

export default function StatusActions({ status, onChangeStatus }) {
  const nextStatuses = ALLOWED_STATUS_TRANSITIONS[status] || [];

  if (nextStatuses.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {nextStatuses.map((next) => {
        const Icon = STATUS_UI[next]?.icon;
        const label = STATUS_UI[next]?.label ?? next;

        return (
          <button
            key={next}
            onClick={() => onChangeStatus(next)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Icon size={28} />
            <span
              style={{
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}