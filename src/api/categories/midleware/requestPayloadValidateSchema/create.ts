import Joi from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
});

export { createSchema };
