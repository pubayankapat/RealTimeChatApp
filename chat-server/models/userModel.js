import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
        type: string,
        require: true,
        minLength: 6
    },
    profileimg: {
        type: string,
        require:true,
        default:""
    }
},{Timestamp:true});

const User = mongoose.model("User",userschma);

export default User