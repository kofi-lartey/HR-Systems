import Joi from "joi";

export const employeeSchema = Joi.object({
    id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string(),
    jobTitle: Joi.string(),
    department: Joi.string().required(),
    headOfDepartment: Joi.string().required(),
    role: Joi.string().valid("hrAdmin","headOfDepartment","staff"),
    hireDate: Joi.string(),
    salary: Joi.number()
})

export const employeeRoleSchema = Joi.object({
    role: Joi.string().valid("hrAdmin","headOfDepartment","staff").required()
})