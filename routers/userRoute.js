import { Router } from "express";
import { alluser, changePassword, login, logoutUser, signUp, updateUserProfile, userProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";


export const userRoute = Router();

userRoute.post('/users/signUp',signUp);
userRoute.post('/users/login',login);
userRoute.post('/users/change-password',authenticate,changePassword);
userRoute.post('/users/logout',logoutUser);
userRoute.get('/auth/profile',userProfile);
userRoute.get('/users/',alluser);
userRoute.patch('/auth/update-profile',authenticate,updateUserProfile);