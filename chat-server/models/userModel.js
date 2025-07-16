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
        enum: ['male','female']
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    profilepic: {
        type: String,
        require:true,
        default:""
    }
},{Timestamp:true});

const User = mongoose.model("User",userSchema);

export default User