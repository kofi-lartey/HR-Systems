import { Router } from "express";
import { allEmployee, deleteEmployee, employee, singleEmployee, updateEmployee, updateEmployeerole } from "../controllers/employeeController.js";
import { authenticate } from "../middleware/auth.js";


export const employeeRoute = Router();

employeeRoute.post('/employee',authenticate,employee)
employeeRoute.get('/employee',allEmployee)
employeeRoute.get('/employee/:id',authenticate,singleEmployee)
employeeRoute.put('/employee/:id',authenticate,updateEmployee)
employeeRoute.patch('/employee-role/:id',authenticate,updateEmployeerole)
employeeRoute.delete('/employee/:id',authenticate,deleteEmployee)
