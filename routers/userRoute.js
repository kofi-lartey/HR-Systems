import { Router } from "express";
import { login, signUp } from "../controllers/userController.js";


export const userRoute = Router();

userRoute.post('/users/signUp',signUp);
userRoute.post('/users/login',login);