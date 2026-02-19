import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string()
           .pattern(/^[a-zA-Z0-9 ]+$/) // letters, numbers, spaces
           .min(5)
           .max(30)
           .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("customer", "admin", "agent").optional(),
});
