import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number().positive(),
  quantity: Joi.number().positive(),
  is_active: Joi.boolean(),
  variation_1: Joi.array().items(Joi.string()),
  variation_2: Joi.array().items(Joi.string()),
  category_id: Joi.number().integer().positive(),
});

export { updateSchema };
