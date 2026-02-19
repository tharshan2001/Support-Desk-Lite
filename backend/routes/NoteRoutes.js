import express from "express";
import { addInternalNote, getInternalNotes } from "../controllers/NoteController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only Admin and Agent can access these routes
router.post("/", protect, authorizeRoles("admin", "agent"), addInternalNote);
router.get("/", protect, authorizeRoles("admin", "agent"), getInternalNotes);

export default router;
