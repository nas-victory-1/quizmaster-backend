import express from 'express';
import { createQuizSession, joinQuiz, getSessionInfo, startQuiz, getSessionById } from './session.controller';

const router = express.Router();

// Create session
router.post('/create', createQuizSession);

// Join with code
router.post('/join-quiz', joinQuiz);

// Start quiz
router.post('/start/:sessionId', startQuiz);

// Get session info by code
router.get('/:code', getSessionInfo);

// Get session by ID (for waiting room)
router.get('/session/:sessionId', getSessionById);

export default router;