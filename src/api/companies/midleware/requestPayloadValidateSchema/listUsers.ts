import Joi from "joi";

const listUsersSchema = Joi.object({
  page: Joi.number().integer().positive().required(),
  limit: Joi.number().integer().positive().min(10).max(100).required(),
  filter_by_user_id: Joi.number().integer().positive().min(1),
  filter_by_user_name: Joi.string().min(1),
  filter_by_company_id: Joi.number().integer().positive().min(1),
  filter_by_company_name: Joi.string().min(1),
});

export { listUsersSchema };