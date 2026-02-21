import api from "../service/api"; // axios instance with withCredentials

// ---------------------- Tickets ----------------------
export const getMyTickets = async () => {
  try {
    const res = await api.get("/tickets/my");
    return res.data.data; // { tickets, page, total, ... }
  } catch (err) {
    console.error("Error in getMyTickets:", err.response || err);
    throw err;
  }
};

// Get ticket by ID 
export const getTicketById = async (id) => {
  try {
    const res = await api.get("/tickets/getTicket", {
      params: { ticketId: id },
    });
    return res.data.data; // ticket object
  } catch (err) {
    console.error(`Error in getTicketById(${id}):`, err.response || err);
    throw err;
  }
};

// Get ticket by ID 
export const getAllTicketsAdmin = async () => {
  try {
    // Requesting a high limit to fetch all tickets for client-side filtering, sorting, and stats.
    const res = await api.get("/tickets/admin", {
      params: { page: 1, limit: 1000 }, 
    });
    
    // Returns the data object containing { tickets, page, limit, total, pages }
    return res.data.data; 
  } catch (err) {
    console.error("Error in getAllTicketsAdmin:", err.response || err);
    throw err;
  }
};

// Update ticket status (FIXED: matches backend route)
export const updateTicketStatus = async (id, status) => {
  try {
    const res = await api.patch("/tickets/status", {
      id,
      status,
    });
    return res.data;
  } catch (err) {
    console.error(`Error in updateTicketStatus(${id}, ${status}):`, err.response || err);
    throw err;
  }
};

// ---------------------- Comments ----------------------

// FIXED: backend expects ticketId as route param
export const getComments = async (ticketId) => {
  try {
    const res = await api.get(`/comments/${ticketId}`);
    return res.data.data || [];
  } catch (err) {
    console.error(`Error in getComments(${ticketId}):`, err.response || err);
    return [];
  }
};

export const addComment = async ({ ticketId, body }) => {
  try {
    const res = await api.post("/comments", { ticketId, body });
    return res.data;
  } catch (err) {
    console.error(`Error in addComment(${ticketId}):`, err.response || err);
    throw err;
  }
};