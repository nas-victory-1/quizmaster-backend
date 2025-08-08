import { body } from "express-validator";

export const quizValidator = [
    
  body("title")
  .notEmpty().withMessage("Title is required"),

  body("category")
  .notEmpty().withMessage("Category is required"),

  body("questions")
  .isArray({ min: 1 }).withMessage("At least one question is required"),

  body("questions.*.text")
  .notEmpty().withMessage("Each question must have text"),

  body("questions.*.options")
  .isArray({ min: 2 }).withMessage("Each question must have at least 2 options"),

  body("questions.*.options.*.text")
  .notEmpty().withMessage("Each option must have text"),

  body("questions.*.options")
  .custom((options) => {
    const hasCorrect = options.some((opt: any) => opt.isCorrect === true);
    if (!hasCorrect) {
      throw new Error("Each question must have at least one correct answer");
    }
    return true;
  }),

  body("settings.date")
  .notEmpty().withMessage("Date is required"),

  body("settings.time")
  .notEmpty().withMessage("Time is required"),
];
