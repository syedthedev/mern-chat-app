import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../Context/AuthContext.jsx';

function ProfilePage() {
  const { backendUrl, authUser, setAuthUser } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName || '');
  const [bio, setBio] = useState(authUser.bio || '');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Update Profile Text only 
      if (!selectedImg) {
        const { data } = await axios.put(`${backendUrl}/api/auth/update-profile`, {
          fullName: name,
          bio,
        });

        if (data.success) {
          setAuthUser(data.user);
          navigate('/');
          toast.success('Profile updated successfully');
        } else {
          toast.error(data.msg);
        }

        return;
      }

      // Update Profile With image
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);

      reader.onload = async () => {
        const base64Image = reader.result;

        const { data } = await axios.put(`${backendUrl}/api/auth/update-profile`, {
          profilePic: base64Image,
          fullName: name,
          bio,
        });

        if (data.success) {
          setAuthUser(data.user);
          navigate('/');
          toast.success('Profile updated successfully');
        } else {
          toast.error(data.msg);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              id="avatar"
              type="file"
              accept="image/png, image/jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
              alt="profile"
              className='w-12 h-12 rounded-full object-cover'
            />
            Upload Profile Image
          </label>

          <input
            type="text"
            placeholder='Your name'
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          <textarea
            rows={4}
            required
            placeholder='Write profile bio'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          ></textarea>

          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save
          </button>
        </form>

        <img
          src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon}
          alt="preview"
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover'
        />
      </div>
    </div>
  );
}

export default ProfilePage;
