import { model, Schema } from 'mongoose';
import normalize from 'normalize-mongoose'

export const departmentModel = new Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    headOfDepartment: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Head of department is required'],
    },
    employees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        },
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
},{ timestamps: true,});

departmentModel.plugin(normalize)
export const Department = model('Department', departmentModel);
