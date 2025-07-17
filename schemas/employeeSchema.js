import Joi from "joi";

export const employeeSchema = Joi.object({
    id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string(),
    jobTitle: Joi.string(),
    department: Joi.string(),
    hireDate: Joi.string(),
    salary: Joi.number()
})