import User from '../Schema/userSchema.js';
import jwt from 'jsonwebtoken';
import { hashPassword,comparePassword } from '../Helper/Helper.js';
import cloudinary from '../Helper/Cloudinary.js';

// Register
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    if (!fullName || !email || !password || !bio) {
        return res.json({ success: false, msg: 'Missing details' });
    }

    try {
        const existUser = await User.findOne({ email });
        if (existUser) return res.json({ success: false, msg: 'User already exists' });

        const hash_pass = hashPassword(password);
        const user = await User.create({ fullName, email, password: hash_pass, bio });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, userData : user,msg : 'Account created successfully' });
    } catch (err) {
        res.json({ success: false, msg: err.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, msg: 'Email and Password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, msg: 'User not found!' });

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) return res.json({ success: false, msg: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

       res.json({ success: true, userData : user,msg : 'Login successful' });
    } catch (err) {
        res.json({ success: false, msg: err.message });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict'
        });
        res.json({ success: true, msg: 'Logged Out' });
    } catch (err) {
        res.json({ success: false, msg: err.message });
    }
};

// Check Auth 
export const checkAuth = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        return res.json({success : true,user});
    } catch (err) {
        res.json({ success: false, msg: err.message });
    }
}

// Update User Profile
export const updateProfile = async (req,res) => {
    try {
        const {  profilePic, fullName, bio  } = req.body;
        const userId = req.user.id;
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio,fullName},{new : true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic : upload.secure_url,bio,fullName},{new : true});
        } 
        res.json({success : true,user : updatedUser});
    } catch (err) {
        res.json({ success: false, msg: err.message });
    }
}

