import api from "./api";

export const updateTicketStatus = async ({ id, status }) => {
  const res = await api.patch("/tickets/status", {
    id,
    status,
  });
  return res.data;
};