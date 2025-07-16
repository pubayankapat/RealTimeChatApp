import mongoose from "mongoose";



const conversationModel = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"user"
        }
    ],
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message",
            default:[]
        }
    ]
},{timestamp:true})

const Conversation =mongoose.model('Conversation',conversationSchema)

export default Conversation;