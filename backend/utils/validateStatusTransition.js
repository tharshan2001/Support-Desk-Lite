import { ALLOWED_STATUS_TRANSITIONS } from "./statusTransitions.js";

export const isValidStatusTransition = (from, to) => {
  return ALLOWED_STATUS_TRANSITIONS[from]?.includes(to);
};
