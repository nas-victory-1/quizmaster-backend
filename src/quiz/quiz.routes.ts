import express from 'express';
import { getAllQuizzes, createQuiz,getQuizById, deleteQuizById, updateQuiz } from './quiz.controller';
import { validation } from '../middleware/validate.middleware';
import { quizValidator } from './quiz.validator';
import authorization from 'middleware/auth.middleware';

const router = express.Router();

router.get('/quizzes', authorization, getAllQuizzes);
router.get("/quizzes/:id", authorization, getQuizById);
router.post('/create-quiz', authorization, createQuiz);
router.delete('/quizzes/:id', authorization, deleteQuizById);
router.put('/quizzes/:id', authorization, updateQuiz);

export default router;