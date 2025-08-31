import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectToDb } from './config/mongodb';
import userRoutes from './user/user.routes';
import quizRoutes from './quiz/quiz.routes';
import sessionRoutes from './session/session.routes';
import { setupSocketHandlers } from './socket/socketHandlers';

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

// Database connection
connectToDb();

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/session', sessionRoutes);

// Setup Socket.IO handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
});

export { io };