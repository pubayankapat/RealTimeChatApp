import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    gender: {
        type: String,
        require: true,
        enum: ['male','female','others']
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    profilepic: {
        type: String,
        default:""
    }
},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User