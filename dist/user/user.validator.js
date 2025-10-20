"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Enter name")
        .isString().withMessage("Name must be a string"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];
//# sourceMappingURL=user.validator.js.map