import express from "express";
import { sendOtp, verifyOtp } from "../routerController/otpRoutController.js";

const otpRout = express.Router();

otpRout.post('/sendOtp', sendOtp);
otpRout.post('/verifyOtp', verifyOtp);

export default otpRout;