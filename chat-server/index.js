import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./database/dbConnect.js";
import authRout from './rout/authUser.js';
import messageRout from './rout/messageRout.js';
import cookieParser from "cookie-parser";
import userRout from "./rout/userRout.js";
import {app, server} from './socket/socket.js';
import uploadRouter from "./rout/uploadItem.js";
import cors from 'cors';
import groupRout from "./rout/groupRout.js";

dotenv.config();

dbConnect();
const PORT = process.env.PORT;
app.get('/',(req,res)=>{
    res.send("Server working");
})
server.listen(PORT, "0.0.0.0", ()=>{
    console.log(`Server running`);
})

// Enable CORS for REST APIs (dev: 5173, Docker: 80, prod domain)
app.use(cors({
  origin: [
    "http://chatrix.chickenkiller.com", // production domain
    "http://localhost",                 // Docker / Nginx on port 80
    "http://localhost:5173"             // Vite dev server
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRout);
app.use('/api/message',messageRout);
app.use('/api/user', userRout);
app.use('/api/s3Url', uploadRouter);
app.use('/api/create', groupRout);
