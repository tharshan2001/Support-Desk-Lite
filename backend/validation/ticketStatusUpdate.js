import Joi from "joi";

export const ticketStatusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .required(),
});
