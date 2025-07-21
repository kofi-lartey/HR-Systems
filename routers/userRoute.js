import { Router } from "express";
import { login, logoutUser, signUp, updateUserProfile, userProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";


export const userRoute = Router();

userRoute.post('/users/signUp',signUp);
userRoute.post('/users/login',login);
userRoute.post('/users/logout',logoutUser);
userRoute.get('/auth/profile',userProfile);
userRoute.patch('/auth/update-profile',authenticate,updateUserProfile);