import express from "express";
import {createTicket, updateTicketStatus,} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);

router.patch("/status", protect, authorizeRoles("admin", "agent"), updateTicketStatus);

export default router;
