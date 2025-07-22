import { Router } from "express";
import { attendance, attendanceOut, filterAttendance, getAllAttendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";
import { authenticate } from "../middleware/auth.js";


export const attendanceRoute = Router();
attendanceRoute.post('/attendance',authenticate,attendance)
attendanceRoute.post('/attendance-Out',authenticate,attendanceOut)
attendanceRoute.get('/All-attendance',getAllAttendance)
attendanceRoute.get('/filter-attendance',filterAttendance) // by date or department or both
attendanceRoute.get('/attendance',authenticate,userAttendance)
attendanceRoute.get('/attendance/:id',authenticate,getEmployeeWithAttendance)