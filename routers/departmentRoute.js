import { Router } from "express";
import { department } from "../controllers/managementController.js";
import { authenticate } from "../middleware/auth.js";

export const departmentRoute = Router();

departmentRoute.post('/department',authenticate,department)