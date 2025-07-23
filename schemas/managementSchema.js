import Joi from "joi";

export const departmentSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().allow('').optional(),
    createdBy: Joi.string(),
    status: Joi.string().valid('active', 'inactive').default('active'),
})