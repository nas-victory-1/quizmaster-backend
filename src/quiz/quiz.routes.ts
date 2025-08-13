import express from 'express';
import { getAllQuizzes, createQuiz,getQuizById, deleteQuizById, updateQuiz } from './quiz.controller';
import { validation } from '../middleware/validate.middleware';
import { quizValidator } from './quiz.validator';

const router = express.Router();

router.get('/quizzes', getAllQuizzes);
router.get("/quizzes/:id", getQuizById);
router.post('/create-quiz', createQuiz);
router.delete('/quizzes/:id', deleteQuizById);
router.put('/quizzes/:id', updateQuiz);

export default router;