import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const isLogin = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) return res.status(500).send({ success: false, message: "User unathorised" });
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if (!decode) return res.status(500).send({ success: false, message: "User-unauthorised Invalid token" })
        const user = User.findById(decode.userId).select("-password");
        if (!user) return res.status(500).send({ success: false, message: "User not found" })
        req.user = user;
        next()
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
}

export default isLogin;