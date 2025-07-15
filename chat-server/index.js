import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./database/dbConnect.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.get('/',(req,res)=>{
    res.send("Server working");
})

app.listen(PORT, ()=>{
    dbConnect();
    console.log(`Working at http://localhost:${PORT}`);
})