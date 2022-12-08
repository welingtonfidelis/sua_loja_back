import Joi from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
  is_active: Joi.boolean().required(),
  variation_1: Joi.array().items(Joi.string()).required(),
  variation_2: Joi.array().items(Joi.string()).required(),
  category_id: Joi.number().integer().positive().required(),
});

export { createSchema };
