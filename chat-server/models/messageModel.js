import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recieverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message:{
        type: String,
        required: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        default:[]
    },
     group: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Group"
    }
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema)

export default Message