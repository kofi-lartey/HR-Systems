import { Router } from "express";
import { allEmployee, deleteEmployee, employee, singleEmployee, updateEmployee } from "../controllers/employeeController.js";
import { authenticate } from "../middleware/auth.js";


export const employeeRoute = Router();

employeeRoute.post('/employee',authenticate,employee)
employeeRoute.get('/employee',allEmployee)
employeeRoute.get('/employee/:id',authenticate,singleEmployee)
employeeRoute.put('/employee/:id',authenticate,updateEmployee)
employeeRoute.delete('/employee/:id',authenticate,deleteEmployee)
