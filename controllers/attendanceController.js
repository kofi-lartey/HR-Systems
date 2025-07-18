import { Attendance } from "../models/attendanceModel.js";
import { Employee } from "../models/employeeModel.js";
import { User } from "../models/userModel.js";
import { attendanceSchema, userAttendanceSchema } from "../schemas/attendanceSchema.js";

// export const attendance = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { error, value } = attendanceSchema.validate(req.body)
//         if (error) {
//             return res.status(400).json({ message: error.details[0].message })
//         }
//         if (!userId) {
//             return res.status(400).json({ message: 'Not Authourize' })
//         }
//         const user = await User.findById(userId)
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }
//         const employee = await Employee.findOne({ user: user._id });
//         if (!employee) {
//             return res.status(400).json({ message: 'Employee not found' })
//         }

//         const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

//         const attendanceData = await Attendance.create({
//             ...value,
//             id: employee.id,
//             employee: employee._id,
//             date: new Date(),
//             clockIn: new Date().toTimeString().split(' ')[0], // "08:45:12"
//             ipAddress: ip
//         })

//         if (attendance.clockIn > '09:00:00') {
//             attendance.status = 'late';
//           let status =  await attendance.save();
//         }

//         if (attendance.clockIn >= '09:00:00') {
//             attendance.status = 'ontime';
//             let status = await attendance.save();
//         }

//         if (attendance.clockIn < '09:00:00') {
//             attendance.status = 'early';
//             let status = await attendance.save();
//         }
//         // if (attendance.clockIn === '') {
//         //     attendance.available = 'absent or leave';
//         //     await attendance.save();
//         // }

//         console.log("Attendance", attendanceData)
//         return res.status(200).json({ message: 'Attendance Created Successfully 🎉', attendanceData })
//     } catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// }


export const attendance = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate input
        const { error, value } = attendanceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        if (!userId) {
            return res.status(400).json({ message: 'Not Authorized' });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Find employee record
        const employee = await Employee.findOne({ user: user._id });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        // Get IP Address
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Get today's start and end (for checking duplicates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            employee: employee._id,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: 'Attendance already submitted for today'
            });
        }

        // Get current time
        const now = new Date();
        const clockInTime = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

        // Compare using only time (with fixed base date)
        const threshold = new Date(`1970-01-01T09:00:00`);
        const actualClockIn = new Date(`1970-01-01T${clockInTime}`);

        let status = 'early';
        if (actualClockIn > threshold) {
            status = 'late';
        } else if (actualClockIn.getTime() === threshold.getTime()) {
            status = 'ontime';
        }

        // Create attendance
        const attendanceData = await Attendance.create({
            ...value,
            id: employee.id,
            employee: employee._id,
            date: now,
            clockIn: clockInTime,
            ipAddress: ip,
            status
        });

        return res.status(200).json({
            message: 'Attendance Created Successfully 🎉',
            attendanceData
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const userAttendance = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'Not Authorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const employee = await Employee.findOne({ user: user._id });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const findUserAttendance = await Attendance.find({ employee: employee._id }).populate('employee');

        return res.status(200).json({
            message: 'User Attendance retrieved successfully',
            attendance: findUserAttendance
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getEmployeeWithAttendance = async (req, res) => {
    try {
        const employeeId = req.params.id;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const attendanceRecords = await Attendance.find({ employee: employeeId });

        return res.status(200).json({
            message: "Employee attendance fetched successfully",
            employee,
            attendance: attendanceRecords,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

