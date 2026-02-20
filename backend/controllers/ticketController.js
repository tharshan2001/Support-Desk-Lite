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
    const ticketId = req.body.id;

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

export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, tag, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;

    if (search) {
      query.$text = { $search: search };
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageLimit = Math.min(Number(limit), 50);
    const skip = (pageNumber - 1) * pageLimit;

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    const total = await Ticket.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: "Server error",
    });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const { status, priority, tag, search, page = 1, limit = 10 } = req.query;

    const query = {
      createdBy: req.user.id,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;

    if (search) {
      query.$text = { $search: search };
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageLimit = Math.min(Number(limit), 50);
    const skip = (pageNumber - 1) * pageLimit;

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    const total = await Ticket.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: "Server error",
    });
  }
};

//get by Id
export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.query;

    if (!ticketId) {
      return res.status(400).json({ message: "ticketId is required" });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    console.error("Error in getTicketById:", err);
    res.status(500).json({
      success: false,
      data: null,
      error: "Server error",
    });
  }
};
