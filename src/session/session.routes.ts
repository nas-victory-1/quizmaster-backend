import express from 'express';
import { createQuizSession, joinQuiz, getSessionInfo, startQuiz, getSessionById, updateParticipantScores } from './session.controller';
import authorization from 'middleware/auth.middleware';

const router = express.Router();

// Create session
router.post('/create', authorization, createQuizSession);

// Join with code
router.post('/join-quiz', joinQuiz);

// Start quiz
router.post('/start/:sessionId', authorization, startQuiz);

// Get session info by code
router.get('/:code', getSessionInfo);

// Get session by ID (for waiting room)
router.get('/session/:sessionId', getSessionById);

router.post('/:sessionId/update-score', updateParticipantScores);

export default router;