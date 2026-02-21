import express from "express";
import {
  createTicket,
  updateTicketStatus,
  getAllTickets,
  getMyTickets,
  getTicketById,
} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("customer"), createTicket);

router.patch(
  "/status",
  protect,
  authorizeRoles("admin", "agent"),
  updateTicketStatus,
);

router.get("/admin", protect, authorizeRoles("admin", "agent"), getAllTickets);

router.get("/getTicket", protect, authorizeRoles("customer","admin", "agent"), getTicketById);

router.get("/my", protect, authorizeRoles("customer"), getMyTickets);

export default router;
