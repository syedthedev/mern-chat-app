import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    senderId : {type : mongoose.Schema.Types.ObjectId,ref : 'user',required : true},
    receiverId : {type : mongoose.Schema.Types.ObjectId,ref : 'user',required : true},
    text : {type : String},
    image : {type : String},
    seen : {type : Boolean}
},{ timestamps : true });

const Message = mongoose.models.message || mongoose.model('message',msgSchema);
export default Message;