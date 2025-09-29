import express from "express";
import {
  createQuizSession,
  joinQuiz,
  getSessionInfo,
  startQuiz,
  getSessionById,
  updateParticipantScores,
} from "./session.controller";
import authorization from "../middleware/auth.middleware";
import { validation } from "../middleware/validate.middleware";
import {
  createSessionValidator,
  joinQuizValidator,
  updateScoreValidator,
} from "./session.validator";

const router = express.Router();

// Create session - PROTECTED + VALIDATED
router.post(
  "/create",
  authorization,
  createSessionValidator,
  validation,
  createQuizSession
);

// Join with code - PUBLIC but validated
router.post("/join-quiz", joinQuizValidator, validation, joinQuiz);

// Start quiz - PROTECTED + CREATOR VALIDATION
router.post("/start/:sessionId", authorization, startQuiz);

// Get session info by code - PUBLIC
router.get("/:code", getSessionInfo);

// Get session by ID - PROTECTED
router.get("/session/:sessionId", authorization, getSessionById);

// Update scores - PROTECTED + VALIDATED
router.post(
  "/:sessionId/update-score",
  authorization,
  updateScoreValidator,
  validation,
  updateParticipantScores
);

export default router;
