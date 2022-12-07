import Joi from "joi";

const listCategoriesSchema = Joi.object({
  company_name_key: Joi.string().min(3).required(),
  page: Joi.number().integer().positive().required(),
  limit: Joi.number().integer().positive().min(10).max(100).required(),
  filter_by_name: Joi.string().min(1)
});

export { listCategoriesSchema };