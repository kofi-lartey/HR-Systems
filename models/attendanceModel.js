import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'
export const attendanceModel = new Schema({
    id: {
        type: String,
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    },
    date: {
        type: Date,
        required: true
    },
    clockIn: {
        type: String,
        required: true
    },
    clockOut: {
        type: String,
    },
    available: {
        type: String,
        enum: ['present', 'absent or leave'],
        default: "present"
    },
    status: {
        type: String,
        enum: ['early', 'late', 'ontime'],
    },
    ipAddress: {
        type: String,
    },
}, { timestamps: true })
attendanceModel.plugin(normalize)
export const Attendance = model('Attendance', attendanceModel)