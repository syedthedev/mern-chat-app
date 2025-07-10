import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import { ChatContext } from '../Context/ChatContext.jsx';

function Sidebar() {
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { handleLogout, onlineUsers } = useContext(AuthContext);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  // Auto-close menu on outside click
  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      <div className='pb-5'>
        <div className='flex justify-between items-center relative'>
          <img src={assets.logo} alt='logo' className='max-w-40' />

          {/* Menu Icon */}
          <div
            className='py-2 relative z-30'
            onClick={(e) => {
              e.stopPropagation(); // prevent auto-close
              setShowMenu((prev) => !prev);
            }}
          >
            <img
              src={assets.menu_icon}
              alt='menu'
              className='max-h-5 cursor-pointer'
            />
            <div
              className={`absolute top-full right-0 mt-2 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 transition-all duration-200 ${
                showMenu ? 'block' : 'hidden'
              }`}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside menu
            >
              <p
                onClick={() => {
                  navigate('/profile');
                  setShowMenu(false);
                }}
                className='cursor-pointer text-sm'
              >
                Edit Profile
              </p>
              <hr className='my-2 border-t border-gray-500' />
              <p
                className='cursor-pointer text-sm'
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt='search' className='w-3' />
          <input
            onChange={(e) => setInput(e.target.value)}
            type='text'
            className='bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1'
            placeholder='Search User...'
          />
        </div>
      </div>

      {/* User List */}
      <div className='flex flex-col'>
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-xs ${
              selectedUser?._id === user._id && 'bg-[#282142]/50'
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt='profile'
              className='w-[35px] aspect-[1/1] rounded-full'
            />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className='text-green-400 text-xs'>Online</span>
              ) : (
                <span className='text-gray-400 text-xs'>Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
