import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  is_blocked: Joi.boolean(),
  delete_image: Joi.boolean(),
});

export { updateSchema };
