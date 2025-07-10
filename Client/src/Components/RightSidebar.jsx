import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../Context/ChatContext.jsx';
import { AuthContext } from '../Context/AuthContext.jsx';

function RightSideBar() {
  const { selectedUser, messages } = useContext(ChatContext);
  const { authUser, handleLogout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // Load only image messages
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]);

  // Do NOT show sidebar if selectedUser is null or current user
  if (!selectedUser || selectedUser._id === authUser?._id) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-20 aspect-square rounded-full"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>

      <hr className="my-4 border-[#ffffff50]" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url, '_blank')}
              className="cursor-pointer rounded"
            >
              <img src={url} alt="media" className="h-full rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="absolute cursor-pointer bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r
        from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full"
      >
        Logout
      </button>
    </div>
  );
}

export default RightSideBar;
