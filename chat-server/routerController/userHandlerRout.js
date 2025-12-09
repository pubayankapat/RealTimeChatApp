import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        const currentUserId = req.user._conditions._id;
        const user = await User.find({
            $and:[
                {
                    $or:[
                        { username: { $regex: '.*' + search + '.*', $options: 'i' } },
                        { fullname: { $regex: '.*' + search + '.*', $options: 'i' } }
                    ]
                },
                {
                    _id:{$ne: currentUserId}
                }
            ]
        }).select("-password").select("email")
        res.status(200).send(user)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


export const getCurrentChatters = async(req,res) => {
    try {
        const currentUserID = req.user._conditions._id;
        const currenTChatters = await Conversation.find({
            participants:currentUserID
        }).sort({
            updatedAt: -1
            });

            if(!currenTChatters || currenTChatters.length === 0)  return res.status(200).send([]);

            const partcipantsIDS = currenTChatters.reduce((ids,conversation)=>{
                const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
                return [...ids , ...otherParticipents]
            },[])

            const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

            // Include all user fields except password so email is available in the client
            const user = await User.find({ _id: { $in: otherParticipentsIDS } }).select("-password");

            const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));

            res.status(200).send(users)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}
