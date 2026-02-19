import express from "express";
import {createTicket, updateTicketStatus,} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/tickets
 * @desc    Create a new ticket
 * @access  Private (any logged-in user)
 */
router.post("/", protect, createTicket);

/**
 * @route   PATCH /api/tickets/:id/status
 * @desc    Update ticket status
 * @access  Private (Admin, Agent)
 */
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "agent"),
  updateTicketStatus
);

export default router;
