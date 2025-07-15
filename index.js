import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MONGOURI, PORT } from './config/env.js';
import { userRoute } from './routers/userRoute.js';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/V1/users', userRoute)

dotenv.config();

await mongoose.connect(MONGOURI);

app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})