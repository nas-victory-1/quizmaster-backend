import { body } from "express-validator";

export const createSessionValidator = [
  body("quizId")
    .notEmpty()
    .withMessage("Quiz ID is required")
    .isMongoId()
    .withMessage("Invalid quiz ID format"),

  body("creatorId").notEmpty().withMessage("Creator ID is required"),
];

export const joinQuizValidator = [
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be 6 characters"),

  body("participantName")
    .notEmpty()
    .withMessage("Participant name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Participant name must be between 1-50 characters"),
];

export const updateScoreValidator = [
  body("participantId").notEmpty().withMessage("Participant ID is required"),

  body("finalScore")
    .isNumeric()
    .withMessage("Final score must be a number")
    .isFloat({ min: 0 })
    .withMessage("Final score cannot be negative"),
];
