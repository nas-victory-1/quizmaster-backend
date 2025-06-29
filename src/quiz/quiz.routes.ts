import express from 'express';
import { getAllQuizzes, addQuiz } from './quiz.controller';
import { validation } from 'middleware/validate.middleware';
import { quizValidator } from './quiz.validator';

const router = express.Router();

router.get('/quizzes', getAllQuizzes);
router.post('/add-quiz', quizValidator, validation, addQuiz);

export default router;