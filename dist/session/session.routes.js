"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_controller_1 = require("./session.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const session_validator_1 = require("./session.validator");
const router = express_1.default.Router();
// Create session - PROTECTED + VALIDATED
router.post("/create", auth_middleware_1.default, session_validator_1.createSessionValidator, validate_middleware_1.validation, session_controller_1.createQuizSession);
// Join with code - PUBLIC but validated
router.post("/join-quiz", session_validator_1.joinQuizValidator, validate_middleware_1.validation, session_controller_1.joinQuiz);
// Start quiz - PROTECTED + CREATOR VALIDATION
router.post("/start/:sessionId", auth_middleware_1.default, session_controller_1.startQuiz);
// Get session info by code - PUBLIC
router.get("/:code", session_controller_1.getSessionInfo);
// Get session by ID - PROTECTED
router.get("/session/:sessionId", auth_middleware_1.default, session_controller_1.getSessionById);
// Update scores - PROTECTED + VALIDATED
router.post("/:sessionId/update-score", auth_middleware_1.default, session_validator_1.updateScoreValidator, validate_middleware_1.validation, session_controller_1.updateParticipantScores);
exports.default = router;
//# sourceMappingURL=session.routes.js.map