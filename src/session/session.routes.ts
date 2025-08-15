import express from 'express';
import { createQuizSession, joinQuiz, getSessionInfo, startQuiz } from './session.controller';



const router = express.Router();
//create session
router.post('/create', createQuizSession);
//join with code
router.post('/join', joinQuiz);
//get sesssion info
router.get('/:code', getSessionInfo);
//start quiz
router.patch('/start/:sessionId', startQuiz);

export default router;