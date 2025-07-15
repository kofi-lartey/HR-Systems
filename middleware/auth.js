import { SECRET } from "../config/env.js";
import jwt from 'jsonwebtoken';


export const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};