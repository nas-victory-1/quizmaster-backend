import { body } from "express-validator";


export const userValidator = [
  body("name")
    .notEmpty().withMessage("Enter name")
    .isString().withMessage("Name must be a string"),

    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

]
