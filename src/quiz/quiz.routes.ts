import express from 'express';
import { getAllQuizzes } from './quiz.controller';

const router = express.Router();

router.get('/quizzes', getAllQuizzes);

export default router;