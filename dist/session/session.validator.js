"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScoreValidator = exports.joinQuizValidator = exports.createSessionValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createSessionValidator = [
    (0, express_validator_1.body)("quizId")
        .notEmpty()
        .withMessage("Quiz ID is required")
        .isMongoId()
        .withMessage("Invalid quiz ID format"),
    (0, express_validator_1.body)("creatorId").notEmpty().withMessage("Creator ID is required"),
];
exports.joinQuizValidator = [
    (0, express_validator_1.body)("code")
        .notEmpty()
        .withMessage("Code is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("Code must be 6 characters"),
    (0, express_validator_1.body)("participantName")
        .notEmpty()
        .withMessage("Participant name is required")
        .isLength({ min: 1, max: 50 })
        .withMessage("Participant name must be between 1-50 characters"),
];
exports.updateScoreValidator = [
    (0, express_validator_1.body)("participantId").notEmpty().withMessage("Participant ID is required"),
    (0, express_validator_1.body)("finalScore")
        .isNumeric()
        .withMessage("Final score must be a number")
        .isFloat({ min: 0 })
        .withMessage("Final score cannot be negative"),
];
//# sourceMappingURL=session.validator.js.map