import Comment from "../models/comment.js";
import Ticket from "../models/ticket.js";
import mongoose from "mongoose";
import { commentSchema } from "../validation/commentValidation.js";

// Add a comment (all users)
export const addComment = async (req, res) => {
  // Validate request body
  const { error, value } = commentSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const details = error.details.map((d) => d.message);
    return res
      .status(400)
      .json({ success: false, message: "Validation error", details });
  }

  const { ticketId, body } = value;

  // Check if ticketId is valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ticket ID" });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket)
    return res
      .status(404)
      .json({ success: false, message: "Ticket not found" });

  try {
    const comment = await Comment.create({
      ticket: ticketId,
      user: req.user.id,
      body,
    });

    const populatedComment = await comment.populate("user", "name email role");
    res.status(201).json({ success: true, data: populatedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all comments for a ticket (all users)
export const getComments = async (req, res) => {
  try {
    const { id: ticketId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ticket ID" });
    }

    const comments = await Comment.find({ ticket: ticketId })
      .populate("user", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
