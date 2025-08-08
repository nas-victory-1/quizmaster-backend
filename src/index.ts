import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { connectToDb } from './config/mongodb';
import userRoutes from './user/user.routes';
import quizRoutes from './quiz/quiz.routes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

connectToDb();



app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

//routes
app.use('/api/auth', userRoutes);
app.use('/api/quiz', quizRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
