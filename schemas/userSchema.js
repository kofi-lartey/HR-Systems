import Joi from "joi";


export const userSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("hrAdmin","headOfDepartment","staff").required(),
    // phoneNumber: Joi.string().required(),
    department: Joi.string().required(),
});

// export const adminSchema = Joi.object({
//     userName: Joi.string().required(),
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//     phoneNumber: Joi.string().required(),
//     admimCode:  Joi.string().required(),
// });

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    // confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip(), //.strip() removes confirm Password from output after validation
});

export const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'New password is required',
    }),
    oldPassword: Joi.string().required()
});

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    })
});