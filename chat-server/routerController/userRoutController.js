import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwtToken from "../utils/jwtWebToken.js";



export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        const user = await User.findOne({ username, email });
        if (user) return res.status(500).send({ success: false, message: "Username or email already exist" });
        const hashPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic
        })

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res)
        } else {
            res.status(500).send({ success: false, message: "Invalid user" });
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            profilepic: newUser.profilepic
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);

    }
}


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(500).send({ success: false, message: "Email doesn't exist or Register" })
        const comparePass = bcrypt.compareSync(password, user.password || "")
        if (!comparePass) return res.status(200).send({ success: false, message: "Email or password is invalid"})

        jwtToken(user._id, res)

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Successfully login"
        })
    } catch (error) {
        res.send(500).send({
            success: false,
            message: error
        }),console.log(error);
        
    }
}


export const userLogout = async(req, res) =>{
    try {
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({success:true, message: "User logout"})
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
}