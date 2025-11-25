import jwt from "jsonwebtoken";

const jwtToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: "30d",
    });

    res.cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.SECURE !== "development", 
    });

    return token;
};

export default jwtToken;
