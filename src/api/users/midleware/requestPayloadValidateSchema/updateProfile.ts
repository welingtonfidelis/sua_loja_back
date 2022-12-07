import Joi from "joi";

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  username: Joi.string(),
  email: Joi.string().email(),
  delete_image: Joi.boolean().allow(Joi.string().valid('true', 'false')),
});

export { updateProfileSchema };