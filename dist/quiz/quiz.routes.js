"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("./quiz.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const quiz_validator_1 = require("./quiz.validator");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
router.get("/quizzes", auth_middleware_1.default, quiz_controller_1.getAllQuizzes);
router.get("/quizzes/:id", auth_middleware_1.default, quiz_controller_1.getQuizById);
router.post("/create-quiz", auth_middleware_1.default, quiz_validator_1.quizValidator, validate_middleware_1.validation, quiz_controller_1.createQuiz);
router.delete("/quizzes/:id", auth_middleware_1.default, quiz_controller_1.deleteQuizById);
router.put("/quizzes/:id", auth_middleware_1.default, quiz_controller_1.updateQuiz);
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map