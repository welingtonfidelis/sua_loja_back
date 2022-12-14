import Joi, { number } from "joi";

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
  delete_images: Joi.array().items(Joi.string()),
  add_variation: Joi.array().items(Joi.object().keys({
    name: Joi.string().min(1),
    value: Joi.array().items(Joi.string()).min(1)
  })),
  update_variation: Joi.array().items(Joi.object().keys({
    id: Joi.number().integer().positive(),
    name: Joi.string().min(1),
    value: Joi.array().items(Joi.string()).min(1)
  })),
  delete_variation: Joi.array().items(Joi.number().integer().positive()),
});

export { updateSchema };
