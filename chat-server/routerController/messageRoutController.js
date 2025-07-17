import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._conditions._id;


        let chat = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        })
        if (!chat) {
            chat = await Conversation.create({
                participants: [senderId, recieverId]
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
            conversationId: chat._id
        })
        if (newMessage) {
            chat.message.push(newMessage._id)
        }

        await Promise.all([chat.save(), newMessage.save()]);

        res.status(201).send(newMessage)
        // SOCKET.IO FUNC TO SEND MESSAGE
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
}


export const getMessage = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user._conditions._id;

        const chat = await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        }).populate("message")

        if(!chat) return  res.status(200).send([]);
        const message = chat.message;
        res.status(200).send(message)
    } catch (error) {
       
    }
}