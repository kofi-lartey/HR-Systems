import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

export const employeeModel = new Schema({
    id:{
        type: String,
        required:true,
    },
    firstName:{
        type: String,
        required:true,
    },
    lastName:{
        type: String,
        required:true,
    },
    email:{
        type: String,
    },
    jobTitle:{
        type: String,
    },
    department:{
        type: String,
    },
    headOfDepartment: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Head of department is required'],
    },
    hireDate:{
        type: String,
    },
    salary:{
        type: Number,
    },
    role:{
        type: String,
        enum: ["hrAdmin","headOfDepartment","staff"],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{timestamps: true});
employeeModel.plugin(normalize);
export const Employee = model("Employee", employeeModel);