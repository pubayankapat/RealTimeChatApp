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

    const otp = crypto.randomInt(100000, 999999).toString();
    // storing otp in redis for 5 min or 300 seconds
    await redis.set(`otp:${email}`, otp, {
        EX: 300
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Chatrix OTP Code",
            text: `Your OTP form Chatrix is: ${otp}. It expires in 5 minutes.`
        });

        res.json({ message: "OTP sent!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const storedOtp = await redis.get(`otp:${email}`);
    try {
        if (storedOtp === otp) {
            await redis.del(`otp:${email}`);
            res.json({ success: true, message: "Otp verfied successfully" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

};
