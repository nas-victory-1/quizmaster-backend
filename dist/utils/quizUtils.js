"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParticipantId = exports.validateQuizCode = exports.generateUniqueCode = void 0;
const session_model_1 = __importDefault(require("../session/session.model"));
const crypto_1 = __importDefault(require("crypto"));
const generateUniqueCode = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code;
    let isUnique = false;
    let attempts = 0;
    do {
        code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        attempts++;
        console.log(`Attempt ${attempts}: Generated code ${code}`);
        // Check if code already exists
        const existingSession = await session_model_1.default.findOne({
            code,
            status: { $ne: "finished" },
            expiresAt: { $gt: new Date() },
        });
        console.log(`Existing session found:`, existingSession ? "YES" : "NO");
        isUnique = !existingSession;
        console.log(`Is unique:`, isUnique);
    } while (!isUnique);
    console.log(`Final code: ${code}`);
    return code;
};
exports.generateUniqueCode = generateUniqueCode;
const validateQuizCode = async (code) => {
    const session = await session_model_1.default.findOne({
        code: code.toUpperCase(),
        status: { $in: ["waiting", "active"] },
        expiresAt: { $gt: new Date() },
    });
    return !!session;
};
exports.validateQuizCode = validateQuizCode;
const generateParticipantId = () => {
    return `participant_${crypto_1.default.randomUUID()}`;
};
exports.generateParticipantId = generateParticipantId;
//# sourceMappingURL=quizUtils.js.map