import Joi from "joi";

export const ticketStatusUpdateSchema = Joi.object({
  id: Joi.string().required(), 
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .required(),
});
