import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDb } from './config/mongodb';
import userRoutes from './user/user.routes';
import quizRoutes from './quiz/quiz.routes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Vite default dev port
  credentials: true, // in case you need cookies later
}));

app.use(cors());
app.use(express.json());
connectToDb();



app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

//routes
app.use('/api/user/', userRoutes);
app.use('/api/quiz', quizRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
