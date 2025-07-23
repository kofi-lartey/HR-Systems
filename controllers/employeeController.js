import { Employee } from "../models/employeeModel.js";
import { User } from "../models/userModel.js";
import { employeeSchema } from "../schemas/employeeSchema.js";


export const employee = async(req,res) =>{
    try {
        // user Id taken from the token
        const userId = req.user.id;
        const{error,value} = employeeSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message});
        }
        
        const {headOfDepartment, email, id, department} = value
        // verify if the head of department exist
        const findHeadofDepartment = await User.findById(headOfDepartment);
        if(!findHeadofDepartment){
            return res.status(400).json({message:'Head of Department not found'})
        }
        // check if the head of Department is truely the head of department
        if(findHeadofDepartment.role !== "headOfDepartment"){
            return res.status(400).json({message:'User is not Head of Department'})
        }

        if(!userId){
            return res.status(400).json({message:'User Id is required'})
        }
        // find the user with  that id
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        // if they are both in the same department(the hod and the one from the body)
        if(findHeadofDepartment.department?.toLowerCase() !== department?.toLowerCase()){
            return res.status(400).json({message:"Head of Department must be in the same Department as the Employee"})
        }
        // check if there is any employee with same email
        const findEmployee = await Employee.findOne({email})
        if(findEmployee){
            return res.status(400).json({message:'Employee with this Email Already Exist'})
        }
        // check if there is any employee with same id
        const findEmployeeID = await Employee.findOne({id})
        if(findEmployeeID){
            return res.status(400).json({message:`Employee with this ID: ${id} Already Exist`})
        }
        // create employee details
        const employeeData = await Employee.create({
            ...value,
            user:userId,
            headOfDepartment:findHeadofDepartment.id
        });
        // populate the employee details with the user
        const populateEmployee = await Employee.findById(employeeData._id)
        .populate({
            path:"user",
            select:'-password'
        })
        .populate({
            path:"headOfDepartment",
            select:'-password'
        })
        console.log('Employee Created', populateEmployee);

        return res.status(200).json({message:'Employee Details created Succefully🎉',populateEmployee})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const allEmployee = async(req,res) =>{
    try {
        const allEmployee = await Employee.find().populate("user","-password")
        console.log('All Employee',allEmployee)
        if(allEmployee.length == 0){
            return res.status(400).json({message:'No Employee'})
        }
        return res.status(200).json({message:'These are all your Employees',allEmployee})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const singleEmployee = async(req,res) =>{
    try {
        // const userId = req.user.id;
        const employeeID = req.params.id
        // if(!userId){
        //     return res.status(400).json({message:'User Id is required'})
        // }
        // // find the user with  that id
        // const user = await User.findById(userId);
        // if(!user){
        //     return res.status(400).json({message:'User not found'});
        // }
        // check if the user has an employee details
        const findEmployee = await Employee.findById(employeeID).populate("user","-password")
        if(!findEmployee){
            return res.status(400).json({message:'Employee Does not Exist'})
        }
    
        console.log('Employee',singleEmployee)
        return res.status(200).json({message:'Your requested Employee',findEmployee})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const updateEmployee = async(req,res) =>{
    try {
        const userId = req.user.id;
        const employeeID = req.params.id
        if(!userId){
            return res.status(400).json({message:'Unauthorize'})
        }
        // find the user with  that id
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        // check if the user has an employee details
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeID,
            req.body,
            {new:true})

        if(!updatedEmployee){
            return res.status(400).json({message:'Employee Does not Exist'})
        }
        console.log('Employee',updatedEmployee)
        return res.status(200).json({message:'Your requested Employee',updatedEmployee})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const deleteEmployee = async(req,res) =>{
    try {
        const userId = req.user.id;
        const employeeID = req.params.id
        if(!userId){
            return res.status(400).json({message:'Unauthorize'})
        }
        // find the user with  that id
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        // check if the user has an employee details
        const delEmployee = await Employee.findByIdAndDelete(employeeID)

        if(!delEmployee){
            return res.status(400).json({message:'Employee Does not Exist'})
        }
        console.log('Employee',delEmployee)
        return res.status(200).json({message:'Employee Deleted Successfully🎉',delEmployee})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}