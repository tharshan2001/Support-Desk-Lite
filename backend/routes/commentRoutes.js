import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a comment (all authenticated users)
router.post("/", protect, addComment);

// Get all comments for a ticket (all authenticated users)
router.get("/:id", protect, getComments);

export default router;
