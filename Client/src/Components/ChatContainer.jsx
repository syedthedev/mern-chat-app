import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../Lib/utils.js';
import { ChatContext } from '../Context/ChatContext.jsx';
import { AuthContext } from '../Context/AuthContext.jsx';
import toast from 'react-hot-toast';

function ChatContainer() {

  const { messages,setMessages,sendMsg,selectedUser,setSelectedUser,getMessages } = useContext(ChatContext);
  const { authUser,onlineUsers } = useContext(AuthContext); 
  const scrollEnd = useRef();

  const [input,setInput] = useState("");

  // Send Msg
  const handleSendMsg = async (event) => {
    event.preventDefault();
    if(input.trim() === "") return null;
      await sendMsg({ text : input.trim() });
      setInput("");
  }

  // Send Images
  const handleSendImage = async (event) => {
    const file = event.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error('Select an image file');
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMsg({ image : reader.result });
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  },[selectedUser]);

  useEffect(() => {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({ behavior : 'smooth'});
    }
  },[messages]);

  return selectedUser ? (
    // Header
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      <div className='flex items-center gap-2 py-3 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile" className='ml-2 w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img src={assets.arrow_icon} alt="arrow" className='md:hidden max-w-7' onClick={() => setSelectedUser(null)} />
        <img src={assets.help_icon} alt="help" className='max-md:hidden max-w-5' />
      </div>
    { /* Chat Area */}
    <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
      {messages.map((msg,index) => (
        <div key={index} className={`flex items-center gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse' }`}>
          {msg.image ? (
            <img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
          ) : (
            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
          )}

          <div className='text-center text-xs'>
            <img src={msg.senderId === authUser._id  ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="image" className='w-7 rounded-full' />
            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
          </div>

        </div>
      ))}

      <div ref={scrollEnd}></div>

    </div> 

    {/* Bottom Area */}
    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
      <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
        <input onChange={(e) => setInput(e.target.value)} value={input}
        onKeyDown={(e) => e.key === "Enter" ? handleSendMsg(e) : null} 
        type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none outline-none rounded-lg text-white placeholder-gray-400' />
        <input type="file" onChange={handleSendImage} id="image" accept='image/png,image/jpeg'hidden />
        <label htmlFor="image"><img src={assets.gallery_icon} alt="upload" className='w-5 mr-2 cursor-pointer' /></label>
      </div>
      <img onClick={handleSendMsg} src={assets.send_button} alt="send" className='w-7 cursor-pointer' />
    </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="logo" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer