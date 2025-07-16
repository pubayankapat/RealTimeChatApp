import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./database/dbConnect.js";
import rout from './rout/authUser.js';

const app = express();
dotenv.config();


dbConnect();
const PORT = process.env.PORT;
app.get('/',(req,res)=>{
    res.send("Server working");
})
app.use(express.json());
app.use('/api/auth',rout);


app.listen(PORT, ()=>{
    console.log(`Working at http://localhost:${PORT}`);
})