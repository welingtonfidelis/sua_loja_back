import { Role } from "@prisma/client";
import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(3),
  permissions: Joi.array().items(Joi.string().valid(...Object.values(Role))),
  is_blocked: Joi.boolean().allow(Joi.string().valid('true', 'false')),
  delete_image: Joi.boolean().allow(Joi.string().valid('true', 'false')),
});

export { updateSchema };
