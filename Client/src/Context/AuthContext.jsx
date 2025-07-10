import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = (props) => {

    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACK_END;

    const navigate = useNavigate();
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [socket,setSocket] = useState(null);

    // Check User Status

    const checkAuth = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/check');
            if(data.success){
                setIsLoggedin(true);
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
            setAuthUser(null);
            setIsLoggedin(false);
      }
        } catch (err) {
            toast.error(err.message);
        }
    }

    // Connect Socket Function To Handle Socket Connection And Online Users Updates

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query : {
                userId : userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        
        newSocket.on("getOnlineUsers",(userIds) => {
            setOnlineUsers(userIds);
        })
    }

    // Logout

      const handleLogout = async () => {
        try {
          const { data } = await axios.get(backendUrl + `/api/auth/logout`);
            if(data.success){
                navigate('/login');
                toast.success(data.msg);
                setIsLoggedin(false);
                setAuthUser(null);
                socket?.disconnect();
            }
        } catch (err) {
          toast.error(err.message);
        }
      }

    // Use Effect Getting User Status

    useEffect(() => {
        checkAuth();
    },[]);


    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        authUser,setAuthUser,
        onlineUsers,
        socket,
        handleLogout,connectSocket
    }

    return(
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}