import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [bio,setBio] = useState("");

  const navigate = useNavigate();
  const [currState,setCurrState] = useState("Sign up");
  const [isDataSubmitted,setIsDataSubmitted] = useState(false);
  
  const { backendUrl,setIsLoggedin,setAuthUser,connectSocket  } = useContext(AuthContext);

   // Login And Registeration
        const handleSubmit = async (event) => {
          try {
            event.preventDefault();
            if(currState === "Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true);
            return;
          }
            if(currState === "Sign up"){
            const { data } = await axios.post(backendUrl + `/api/auth/signup`,{
                  fullName,email,password,bio
              });
              if(data.success){
                  navigate('/');
                  toast.success(data.msg);
                  setIsLoggedin(true);
                  setAuthUser(data.userData);
                  connectSocket(data.userData);
              }else{
                 toast.error(data.msg);
              }
          }else{
            const { data } = await axios.post(backendUrl + `/api/auth/login`,{
                  email,password
              });
              if(data.success){
                  navigate('/');
                  toast.success(data.msg);
                  setIsLoggedin(true);
                  setAuthUser(data.userData);
                  connectSocket(data.userData);
              }else{
                 toast.error(data.msg);
              }
          }
          } catch (err) {
            toast.error(err.message);
          }
    }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt="logo" className='w-[min(30vw,250px)]' />
      {/* right */}
      <form onSubmit={(e) => handleSubmit(e)} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='flex justify-between items-center font-medium text-2xl'>
          {currState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer' />}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
            <input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' 
            placeholder='Full Name' required 
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            />
        )}

        {!isDataSubmitted && (
          <>
            <input type="email" placeholder='Email Address' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
             />
            <input type="password" placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password} />
          </>
        )}

        {currState && isDataSubmitted && (
          <textarea rows={4} placeholder='provide a short bio...' 
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          required
          onChange={(e) => setBio(e.target.value)}
          value={bio}
          ></textarea>
        )}

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox"  />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-5 items-center'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => {setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account <span onClick={() => setCurrState("Sign up")}  className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>
        
      </form>
    </div>
  )
}

export default LoginPage