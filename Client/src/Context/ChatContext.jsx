import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = (props) => {

    axios.defaults.withCredentials = true;

    const { backendUrl,socket } = useContext(AuthContext);

    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);
    const [unseenMessages,setUnseenMessages] = useState({});

    // Function To Get All Users

    const getUsers = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMsg);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    // Function To Get Messages For Selected User
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    // Function To Send Message
    const sendMsg = async (messageData) => {
        try {
             const { data } = await axios.post(backendUrl + `/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMsg) => [...prevMsg,data.newMsg]);
            }else{
                toast.error(data.msg);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    // Function To Subscribe To Msg For Selected User
    const subscribeToMsg = async () => {
        try {
            if(!socket) return;

            socket.on("newMessage",(newMessage) => {
                if(selectedUser && newMessage.senderId === selectedUser._id){
                    newMessage.seen = true;
                    setMessages((prevMsg) => [...prevMsg,newMessage]);
                    axios.put(backendUrl + `/api/messages/mark/${newMessage._id}`);
                }else{
                    setUnseenMessages((prevUnseenMessages) => ({
                        ...prevUnseenMessages,[newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? 
                        prevUnseenMessages[newMessage.senderId] + 1 : 1 
                    }))
                }
            })

        } catch (err) {
            toast.error(err.message);
        }
    }

    // Function To Unsubscribe From Msg
    const unsubscribeFromMsg = () => {
        if(socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMsg();
        return () => {
            unsubscribeFromMsg();
        }
    },[socket,selectedUser]);

    const value = {

        messages,setMessages,
        users,setUsers,
        selectedUser,setSelectedUser,
        getUsers,
        getMessages,
        sendMsg,
        unseenMessages,setUnseenMessages
        
    }

    return(
        <ChatContext.Provider value={value}>
            {props.children}
        </ChatContext.Provider>
    )
}