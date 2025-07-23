import { Router } from "express";
import { allDepartment, department, singleDepartment } from "../controllers/managementController.js";
import { authenticate } from "../middleware/auth.js";

export const departmentRoute = Router();

departmentRoute.post('/department',authenticate,department)
departmentRoute.get('/department/:id',authenticate,singleDepartment)
departmentRoute.get('/department',allDepartment)