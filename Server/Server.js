import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import path from 'path';
import url from 'url';
import userRouter from './Routes/userRoute.js';
import msgRouter from './Routes/msgRoute.js';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express app and HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize socket.io Server
export const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL,'http://localhost:5173'],
    credentials: true,
  }
});

// Store Online Users
export const userSocketMap = {}; // { userId : socketId }

// Socket.io Connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit Online Users To All Connected Clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Database Connection
mongoose.connect(`${process.env.MONGODB_URL}/chat-app`)
  .then(() => console.log('Connected To Database'))
  .catch(() => console.log('Not Connected'));

// Body-Parser
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: false }));

// Cookie-Parser
app.use(cookieParser());

// Cors 
const allowedOrigins = [
  process.env.FRONTEND_URL, // Production 
  'http://localhost:5173',  // Development
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Route
app.use('/api/server', (req, res) => res.sendFile(path.join(__dirname, 'Public', 'Home.html')));
app.use('/api/auth', userRouter);
app.use('/api/messages', msgRouter);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
