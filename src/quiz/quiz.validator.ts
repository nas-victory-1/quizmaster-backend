import { body } from "express-validator";

export const quizValidator = [
    body("question")
    .notEmpty().withMessage("Enter question")
    .isString().withMessage("Question must be a string"),

    body("options")
    .isArray({ min: 2 }).withMessage("Provide at least two options")
    .custom((arr) => arr.every((opt: string) => typeof opt === 'string')).withMessage("Each option must be a string"),

    body("correctAnswer")
    .notEmpty().withMessage("There must be a correct answer")
    .isInt({ min: 0 }).withMessage("Correct answer must be a valid option index"),
]