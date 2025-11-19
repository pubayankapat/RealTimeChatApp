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
            message: "Successfully registered"
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
        if (!comparePass) return res.status(200).send({ success: false, message: "Email or password is invalid" })

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
        res.status(500).send({
            success: false,
            message: error
        }), console.log(error);

    }
}


export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", '', {
            maxAge: 0
        })
        res.status(200).send({ success: true, message: "User logout" })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
}

export const userProfile = async (req, res) => {
    try {

        const _id = req.user._conditions._id;
        const profile = await User.findById(_id)
        if (!profile) return res.status(500).send({ success: false, message: "Profile does not exist" })

        res.status(200).send({
            fullname: profile.fullname,
            username: profile.username,
            profilepic: profile.profilepic,
            email: profile.email
        })
    } catch (error) {
        res.status(500).send(
            {
                success: false,
                message: error
            }
        )
    }
}

export const updateImage = async (req, res) => {
    try {
        const { key } = req.body;
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
        // console.log(imageUrl)
        const user = await User.findByIdAndUpdate(
            req.user._conditions._id,
            { profilepic: imageUrl }
        );
        res.send({
            success: true,
            profilepic: imageUrl,
            message: "Image uploaded successsfully"
        });
    } catch (err) {
        res.status(500).send({ success: false, message: "Image update failed" });
    }
}