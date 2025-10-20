"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizValidator = void 0;
const express_validator_1 = require("express-validator");
exports.quizValidator = [
    (0, express_validator_1.body)("title")
        .notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("category")
        .notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("questions")
        .isArray({ min: 1 }).withMessage("At least one question is required"),
    (0, express_validator_1.body)("questions.*.text")
        .notEmpty().withMessage("Each question must have text"),
    (0, express_validator_1.body)("questions.*.options")
        .isArray({ min: 2 }).withMessage("Each question must have at least 2 options"),
    (0, express_validator_1.body)("questions.*.options.*.text")
        .notEmpty().withMessage("Each option must have text"),
    (0, express_validator_1.body)("questions.*.options")
        .custom((options) => {
        const hasCorrect = options.some((opt) => opt.isCorrect === true);
        if (!hasCorrect) {
            throw new Error("Each question must have at least one correct answer");
        }
        return true;
    }),
    (0, express_validator_1.body)("settings.date")
        .notEmpty().withMessage("Date is required"),
    (0, express_validator_1.body)("settings.time")
        .notEmpty().withMessage("Time is required"),
];
//# sourceMappingURL=quiz.validator.js.map