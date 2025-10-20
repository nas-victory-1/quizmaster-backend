"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParticipantScores = exports.startQuiz = exports.getSessionById = exports.getSessionInfo = exports.joinQuiz = exports.createQuizSession = void 0;
const session_model_1 = __importDefault(require("./session.model"));
const quizUtils_1 = require("../utils/quizUtils");
const quiz_model_1 = __importDefault(require("../quiz/quiz.model"));
// Create a new quiz session
const createQuizSession = async (req, res) => {
    try {
        const { quizId, creatorId } = req.body; // CHANGED: Now takes quizId instead of raw questions
        // Fetch the quiz to get questions and convert structure
        const quiz = await quiz_model_1.default.findById(quizId);
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        // Verify creator owns the quiz
        if (quiz.createdBy.toString() !== creatorId) {
            res.status(403).json({
                success: false,
                message: "You can only create sessions for your own quizzes",
            });
            return;
        }
        // Convert quiz questions to session questions format
        const sessionQuestions = quiz.questions.map((q) => {
            // Convert options from {text, isCorrect} to string array
            const options = q.options.map((opt) => opt.text);
            // Find correct answer index
            const correctAnswerIndex = q.options.findIndex((opt) => opt.isCorrect);
            if (correctAnswerIndex === -1) {
                throw new Error(`Question "${q.text}" has no correct answer`);
            }
            return {
                question: q.text,
                options: options,
                correctAnswer: correctAnswerIndex,
                timeLimit: q.timeLimit || 30,
            };
        });
        const code = await (0, quizUtils_1.generateUniqueCode)();
        const quizSession = new session_model_1.default({
            code: code.toUpperCase(),
            title: quiz.title,
            questions: sessionQuestions, // Use converted questions
            creatorId,
            participants: [],
            status: "waiting",
        });
        await quizSession.save();
        res.status(201).json({
            success: true,
            message: "Created session successfully",
            data: {
                sessionId: quizSession._id,
                code: quizSession.code,
                title: quizSession.title,
            },
        });
    }
    catch (error) {
        console.error("Error in createQuizSession:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create quiz session",
        });
    }
};
exports.createQuizSession = createQuizSession;
// Join a quiz with code
const joinQuiz = async (req, res) => {
    try {
        const { code, participantName } = req.body;
        if (!code || !participantName) {
            res.status(400).json({
                success: false,
                message: "Code and participant name are required",
            });
            return;
        }
        const isValidCode = await (0, quizUtils_1.validateQuizCode)(code);
        if (!isValidCode) {
            res.status(404).json({
                success: false,
                message: "Invalid or expired quiz code",
            });
            return;
        }
        const participantId = (0, quizUtils_1.generateParticipantId)();
        const session = await session_model_1.default.findOneAndUpdate({
            code: code.toUpperCase(),
            status: { $in: ["waiting", "active"] },
        }, {
            $push: {
                participants: {
                    id: participantId,
                    name: participantName,
                    joinedAt: new Date(),
                    score: 0,
                },
            },
        }, { new: true });
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Quiz session not found",
            });
            return;
        }
        console.log("Current participants:", session.participants);
        res.status(200).json({
            success: true,
            data: {
                sessionId: session._id,
                participantId,
                quizTitle: session.title,
                status: session.status,
                participantCount: session.participants.length,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to join quiz",
        });
    }
};
exports.joinQuiz = joinQuiz;
// Get quiz session info
const getSessionInfo = async (req, res) => {
    try {
        const { code } = req.params;
        const session = await session_model_1.default.findOne({
            code: code.toUpperCase(),
            expiresAt: { $gt: new Date() },
        });
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                title: session.title,
                status: session.status,
                participantCount: session.participants.length,
                currentQuestion: session.currentQuestionIndex,
                totalQuestions: session.questions.length,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch quiz session",
        });
    }
};
exports.getSessionInfo = getSessionInfo;
const getSessionById = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { isCreator } = req.query;
        const session = await session_model_1.default.findById(sessionId);
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Session not found",
            });
            return;
        }
        const baseData = {
            sessionId: session._id,
            title: session.title,
            code: session.code,
            status: session.status,
            participantCount: session.participants.length,
            questions: session.questions, // Include questions for quiz play
            currentQuestionIndex: session.currentQuestionIndex,
        };
        if (isCreator === "true") {
            res.json({
                success: true,
                data: {
                    ...baseData,
                    participants: session.participants,
                },
            });
        }
        else {
            // If participant, just basic info (but still include questions for quiz play)
            res.json({
                success: true,
                data: baseData,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get session",
        });
    }
};
exports.getSessionById = getSessionById;
// Start quiz (for quiz creator)
const startQuiz = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await session_model_1.default.findByIdAndUpdate(sessionId, { status: "active" }, { new: true });
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Quiz session not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Quiz started",
            data: { status: "active" },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to start quiz",
        });
    }
};
exports.startQuiz = startQuiz;
const updateParticipantScores = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { participantId, finalScore } = req.body;
        const session = await session_model_1.default.findByIdAndUpdate(sessionId, {
            $set: {
                "participants.$[elem].score": finalScore,
            },
        }, {
            arrayFilters: [{ "elem.id": participantId }],
            new: true,
        });
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Session not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Score updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update score",
        });
    }
};
exports.updateParticipantScores = updateParticipantScores;
//# sourceMappingURL=session.controller.js.map