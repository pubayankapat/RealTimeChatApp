import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./database/dbConnect.js";
import authRout from './rout/authUser.js';
import messageRout from './rout/messageRout.js';
const app = express();
dotenv.config();


dbConnect();
const PORT = process.env.PORT;
app.get('/',(req,res)=>{
    res.send("Server working");
})
app.use(express.json());
app.use('/api/auth',authRout);
app.use('/api/message',messageRout);

app.listen(PORT, ()=>{
    console.log(`Working at http://localhost:${PORT}`);
})