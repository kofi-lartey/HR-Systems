import { Router } from "express";
import { attendance, getEmployeeWithAttendance, userAttendance } from "../controllers/attendanceController.js";
import { authenticate } from "../middleware/auth.js";


export const attendanceRoute = Router();
attendanceRoute.post('/attendance',authenticate,attendance)
attendanceRoute.get('/attendance',authenticate,userAttendance)
attendanceRoute.get('/attendance/:id',authenticate,getEmployeeWithAttendance)