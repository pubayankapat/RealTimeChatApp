import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import Group from "../models/groupChat.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

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

        
        // SOCKET.IO FUNC TO SEND MESSAGE
        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).send(newMessage)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(`error in send message${error}`);
        
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
       res.status(500).send(error);
    }
}


export const sendMessageToGroup = async(req, res) => {
    try {
        const { groupId, sender, content } = req.body;

    // ✅ 1. Verify group exists
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // ✅ 2. Save message in DB
    const message = await Message.create({
      senderId: sender,
      message: content,
      group: groupId,
    });

    // ✅ 3. Populate sender info (optional)
    const populatedMsg = await message.populate("sender", "name email");

    // ✅ 4. Emit to group via socket.io
    io.to(groupId).emit("receiveGroupMessage", populatedMsg);

    // ✅ 5. Respond to sender
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMsg,
    });
    } catch (error) {
        
    }
}