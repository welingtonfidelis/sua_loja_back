import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
});

export { updateSchema };
