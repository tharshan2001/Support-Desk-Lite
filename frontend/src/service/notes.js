// src/service/notes.js
import api from "./api";

export const addInternalNote = async ({ ticketId, body }) => {
  const response = await api.post("/notes", {
    ticketId,
    body,
  });

  return response.data;
};


export const getInternalNotes = async (ticketId) => {
  if (!ticketId) {
    throw new Error("ticketId is required");
  }

  const response = await api.get(`/notes/${ticketId}`);
  return response.data;
};