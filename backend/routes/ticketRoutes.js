import express from "express";
import {
  createTicket,
  updateTicketStatus,
  getAllTickets,
  getMyTickets,
} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);

router.patch(
  "/status",
  protect,
  authorizeRoles("admin", "agent"),
  updateTicketStatus,
);

router.get("/admin", protect, authorizeRoles("admin", "agent"), getAllTickets);

router.get("/my", protect, authorizeRoles("customer"), getMyTickets);

export default router;
