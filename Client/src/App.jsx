import React, { useContext } from 'react';
import { Routes,Route, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './Context/AuthContext.jsx';

function App() {
  const { authUser  } = useContext(AuthContext);
  return (
    <div className="bg-[url('/src/assets/bgImage.png')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> :  <Navigate to="/" /> } />
        <Route path='/profile' element={authUser ? <ProfilePage /> :  <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App