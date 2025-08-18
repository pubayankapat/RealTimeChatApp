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
        default:"https://media.istockphoto.com/id/2221502929/vector/flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette.jpg?s=612x612&w=0&k=20&c=UXmJu28hV6V_kdgSdGxSzv86liqvFHu3Kl3-V2P4brc="
    }
},{Timestamp:true});

const User = mongoose.model("User",userSchema);

export default User