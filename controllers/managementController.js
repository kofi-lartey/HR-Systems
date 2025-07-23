import { Employee } from "../models/employeeModel.js"
import { User } from "../models/userModel.js"
import { departmentSchema } from "../schemas/managementSchema.js"
import { Department } from "../models/managementModel.js"

// export const department = async(req,res)=>{
//     try {
//         const userId = req.user.id
//         const {error,value} = departmentSchema.validate(req.body)
//         if(error){
//             return res.status(400).json({message:error.details[0].message})
//         }
//         const {employee,headOfDepartment} = value
//         // find user who is to create the department
//         const finduser = await User.findById(userId)
//         if(!finduser){
//             return res.status(400).json({message:'User not found'})
//         }
//         // find employee
//         const findEmployee = await Employee.findById(employee)
//         if(!findEmployee){
//             return res.status(400).json({message:'Employee not found'})
//         }
//         const depart = findEmployee.headOfDepartment.department
//         // find Head of Department
//         const findHOD = await User.findById(headOfDepartment)
//         if(!findHOD){
//             return res.status(400).json({message:'Head of Department not found'})
//         }
//         // employee's head of department should match the head of department on the management
//         if(findHOD.department !== depart){
//             return res.status(400).json({message:'Employee is not in this department'})
//         }
//         // create Management 
//         const departmentDetails = await Department.create({
//             ...value,
//             createdBy:finduser
//         })

//     } catch (error) {
//         return res.status(500).json({message:error.message})
//     }
// }

export const department = async (req, res) => {
    try {
        const userId = req.user.id;
        const { error, value } = departmentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { employees, headOfDepartment, name } = value;

        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const findHOD = await User.findById(headOfDepartment);
        if (!findHOD) {
            return res.status(400).json({ message: "Head of Department not found" });
        }

        const hodDepartment = findHOD.department;
        if (!hodDepartment || hodDepartment !== name) {
            return res.status(400).json({
                message: "Head of Department must belong to the department being created"
            });
        }

        const findDepartment = await Department.findOne({ name })
        if (findDepartment) {
            return res.status(400).json({ message: "Department Already exist" })
        }

        for (const empId of employees) {
            const findEmp = await Employee.findById(empId).populate("headOfDepartment");
            if (!findEmp) {
                return res.status(400).json({ message: `Employee not found: ${empId}` });
            }

            const empHODDept = findEmp.headOfDepartment?.department;
            if (!empHODDept || empHODDept !== name) {
                return res.status(400).json({
                    message: `Employee ${empId} is not under a head of department that matches the department name`
                });
            }
        }

        const departmentDetails = await Department.create({
            ...value,
            createdBy: findUser._id
        });

        const populatedDepartment = await Department.findById(departmentDetails._id)
            .populate({ path: "createdBy", select: "-password" })
            .populate({ path: "headOfDepartment", select: "-password" })
            .populate({ path: "employees", select: "firstName lastName email position" });

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department: populatedDepartment
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const singleDepartment = async (req, res) => {
    try {
        const departmentID = req.params.id
        // check if the department exist
        const findDepartment = await Department.findById(departmentID)
        if (!findDepartment) {
            return res.status(400).json({ message: 'Department not available' })
        }
        return res.status(200).json({message:'This is the Department you requested',findDepartment})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const allDepartment = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "headOfDepartment", select: "-password" })
      .populate({ path: "employees", select: "firstName lastName email position" });

    if (departments.length === 0) {
      return res.status(404).json({ message: "No departments available" });
    }

    return res.status(200).json({
      success: true,
      message: "These are the available departments",
      departments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateDepartment = async (req, res) => {
  try {
    const departmentID = req.params.id;

    // Check if department exists
    const existingDepartment = await Department.findById(departmentID);
    if (!existingDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Perform update
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentID,
      req.body,
      { new: true }
    )
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "headOfDepartment", select: "-password" })
      .populate({ path: "employees", select: "firstName lastName email position" });

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department: updatedDepartment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletDepartment = async (req, res) => {
  try {
    const departmentID = req.params.id;

    // Check if department exists
    const existingDepartment = await Department.findById(departmentID);
    if (!existingDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Perform delete
    const deletedDepartment = await Department.findByIdAndDelete(departmentID)
    return res.status(200).json({
      success: true,
      message: "Department Deleted successfully",
      department: deletedDepartment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
