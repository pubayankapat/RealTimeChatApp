import nodemailer from "nodemailer";
import crypto from "crypto";
import redis from "../connection/redisConnect.js";
import dotenv from "dotenv";

dotenv.config();

let otpStore = {}; // Use Redis/DB in production

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP
export const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = crypto.randomInt(100000, 999999).toString();
        // storing otp in redis for 5 min or 300 seconds
        await redis.set(`otp:${email}`, otp, {
            EX: 300
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Chatrix OTP Code",
            text: `Your OTP form Chatrix is: ${otp}. It expires in 5 minutes.`
        });

        res.status(200).send({ success: true, message: "OTP sent!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
        console.log(error.message);
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const storedOtp = await redis.get(`otp:${email}`);
        if (storedOtp === otp) {
            await redis.del(`otp:${email}`);
            res.status(200).send({ success: true, message: "Otp verfied successfully" });
        } else {
            res.status(501).send({ success: false, message: "Invalid or expired OTP" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
        console.log(error.message);
    }

};
