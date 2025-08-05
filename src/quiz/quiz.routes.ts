import express from 'express';
import { getAllQuizzes, createQuiz } from './quiz.controller';
import { validation } from '../middleware/validate.middleware';
import { quizValidator } from './quiz.validator';

const router = express.Router();

router.get('/quizzes', getAllQuizzes);
router.post('/create-quiz', quizValidator, validation, createQuiz);

export default router;