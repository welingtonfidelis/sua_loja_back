import Joi from "joi";

const getCompanyProfileSchema = Joi.object({
  company_name_key: Joi.string().min(3).required(),
});

export { getCompanyProfileSchema };