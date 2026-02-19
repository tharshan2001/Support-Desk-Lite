import Joi from "joi";

export const internalNoteSchema = Joi.object({
  ticketId: Joi.string().required().messages({
    "any.required": "Ticket ID is required",
    "string.empty": "Ticket ID cannot be empty",
  }),
  body: Joi.string().min(1).max(1000).required().messages({
    "any.required": "Note body is required",
    "string.empty": "Note body cannot be empty",
    "string.max": "Note body cannot exceed 1000 characters",
  }),
});
