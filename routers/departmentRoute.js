import { Router } from "express";
import { allDepartment, deletDepartment, department, singleDepartment, updateDepartment } from "../controllers/managementController.js";
import { authenticate } from "../middleware/auth.js";

export const departmentRoute = Router();

departmentRoute.post('/department',authenticate,department)
departmentRoute.get('/department/:id',authenticate,singleDepartment)
departmentRoute.patch('/department/:id',authenticate,updateDepartment)
departmentRoute.delete('/department/:id',authenticate,deletDepartment)
departmentRoute.get('/department',allDepartment)