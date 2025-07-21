import { Router } from "express";
import { login, logoutUser, signUp } from "../controllers/userController.js";


export const userRoute = Router();

userRoute.post('/users/signUp',signUp);
userRoute.post('/users/login',login);
userRoute.post('/users/logout',logoutUser);