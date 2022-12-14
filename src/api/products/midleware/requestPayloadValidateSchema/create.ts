import Joi from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
  is_active: Joi.boolean().required(),
  variation: Joi.array().items(Joi.object().keys({
    name: Joi.string().min(1),
    value: Joi.array().items(Joi.string()).min(1)
  })),
  category_id: Joi.number().integer().positive().required(),
});

export { createSchema };
