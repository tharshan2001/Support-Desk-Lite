import InternalNote from "../models/Note.js";
import Ticket from "../models/ticket.js";
import { internalNoteSchema } from "../validation/NoteValidation.js";
import mongoose from "mongoose";

// Add internal note (admin/agent only)
export const addInternalNote = async (req, res) => {
  const { error, value } = internalNoteSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({
        success: false,
        message: "Validation error",
        details: error.details,
      });

  const { ticketId, body } = value;

  if (!mongoose.Types.ObjectId.isValid(ticketId))
    return res
      .status(400)
      .json({ success: false, message: "Invalid ticket ID" });

  const ticket = await Ticket.findById(ticketId);
  if (!ticket)
    return res
      .status(404)
      .json({ success: false, message: "Ticket not found" });

  try {
    const note = await InternalNote.create({
      ticket: ticketId,
      user: req.user.id,
      body,
    });

    const populatedNote = await note.populate("user", "name email role");
    res.status(201).json({ success: true, data: populatedNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all internal notes for a ticket (admin/agent only)
export const getInternalNotes = async (req, res) => {
  const { ticketId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(ticketId))
    return res
      .status(400)
      .json({ success: false, message: "Invalid ticket ID" });

  try {
    const notes = await InternalNote.find({ ticket: ticketId })
      .populate("user", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
