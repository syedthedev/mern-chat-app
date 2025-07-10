import User from "../Schema/userSchema.js";
import Message from "../Schema/msgSchema.js";
import cloudinary from '../Helper/Cloudinary.js';
import { io,userSocketMap } from "../Server.js";

// Get All Users Except The Logged In User
export const getUsersForSidebar = async (req,res) => {
    try {
        const userId = req.user.id;
        const filteredUsers = await User.find({_id : { $ne : userId }}).select("-password");
        // Count Unseen Msg
        const unseenMsg = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId : user._id,receiverId : userId,seen : false});
            if(messages.length > 0){
                unseenMsg[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success : true,users : filteredUsers,unseenMsg});
    } catch (err) {
        res.json({ success: false, msg: err.message });   
    }
}

// Get All Messages 
export const getMessages = async (req,res) => {
    try {
        const { id : selectedUserId } = req.params;
        const userId = req.user.id;
        const messages = await Message.find({
            $or : [
                {senderId : userId,receiverId : selectedUserId},
                {senderId : selectedUserId,receiverId : userId},
            ]
        })
        await Message.updateMany({senderId : selectedUserId,receiverId : userId},{seen : true});
        res.json({success : true,messages});
    } catch (err) {
        res.json({ success: false, msg: err.message });   
    }
}

// API To Mark Message As Seen Using Msg Id
export const markMsgAsSeen  = async (req,res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id,{seen : true});
        res.json({success : true});
    } catch (err) {
        res.json({ success: false, msg: err.message });   
    }
}

// Send New Message To Selected User
export const sendMsg = async (req,res) => {
    try {
        const { text,image } = req.body;
        const senderId = req.user.id;
        const receiverId = req.params.id;
        
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMsg = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        });

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMsg);
        }

        res.json({success : true,newMsg});

    } catch (err) {
        res.json({ success: false, msg: err.message });
    }
}