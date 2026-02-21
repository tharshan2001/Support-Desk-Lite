export const ALLOWED_STATUS_TRANSITIONS = {
  open: ["in_progress"],
  in_progress: ["resolved"],
  resolved: ["closed", "in_progress"],
  closed: [],
};

export const isValidStatusTransition = (from, to) => {
  return ALLOWED_STATUS_TRANSITIONS[from]?.includes(to);
};