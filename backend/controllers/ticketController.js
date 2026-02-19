import Ticket from "../models/ticket.js";
import { ticketCreateSchema } from "../validation/ticketCreate.js";
import { isValidStatusTransition } from "../utils/validateStatusTransition.js";
import { ticketStatusUpdateSchema } from "../validation/ticketStatusUpdate.js";


//create ticket
export const createTicket = async (req, res) => {
  const { error, value } = ticketCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details,
    });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { title, description, priority, tags } = value;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      tags,
      createdBy: req.user.id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




//update status
export const updateTicketStatus = async (req, res) => {
  try {
    //validate input
    const { error, value } = ticketStatusUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    const { status } = value;
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const currentStatus = ticket.status;
    if (!isValidStatusTransition(currentStatus, status)) {
      return res.status(400).json({
        message: `Invalid status transition from '${currentStatus}' to '${status}'`,
      });
    }
    ticket.status = status;
    await ticket.save();

    res.status(200).json(ticket);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
