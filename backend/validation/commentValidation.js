import Joi from "joi";

// Create comment
export const commentSchema = Joi.object({
  ticketId: Joi.string().required().messages({
    "any.required": "Ticket ID is required",
    "string.empty": "Ticket ID cannot be empty",
  }),
  body: Joi.string().min(1).max(1000).required().messages({
    "any.required": "Comment body is required",
    "string.empty": "Comment body cannot be empty",
    "string.max": "Comment body cannot exceed 1000 characters",
  }),
});
