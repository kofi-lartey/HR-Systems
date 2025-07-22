import Joi from "joi";


export const attendanceSchema = Joi.object({
    id: Joi.string(),
    clockIn: Joi.string(),
    clockOut: Joi.string(),
    available: Joi.string()
        .valid('present', 'absent or leave')
        .default('present'),

    date: Joi.date(),
    status: Joi.string()
        .valid('early', 'late', 'ontime'),
    ipAddress: Joi.string()
})

export const userAttendanceSchema = Joi.object({
    employee: Joi.string(),
})