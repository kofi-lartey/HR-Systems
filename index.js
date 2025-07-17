import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MONGOURI, PORT } from './config/env.js';
import { userRoute } from './routers/userRoute.js';
import mongoose from 'mongoose';
import { employeeRoute } from './routers/employeeRoute.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/V1', userRoute)
app.use('/api/V1', employeeRoute)

dotenv.config();

await mongoose.connect(MONGOURI);

app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})