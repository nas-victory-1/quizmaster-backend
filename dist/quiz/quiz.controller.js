"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuiz = exports.deleteQuizById = exports.getQuizById = exports.createQuiz = exports.getAllQuizzes = void 0;
const quiz_model_1 = __importDefault(require("./quiz.model"));
const getAllQuizzes = async (req, res) => {
    try {
        const userId = req.user.id;
        const quizzes = await quiz_model_1.default.find({ createdBy: userId }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            message: "All quizzes retrieved successfully",
            data: quizzes,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error caused by ", error);
        }
        else {
            console.error("Unknown error: ", error);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while retrieving all quizzes",
        });
    }
};
exports.getAllQuizzes = getAllQuizzes;
const createQuiz = async (req, res) => {
    try {
        const { title, description, category, questions, settings } = req.body;
        const userId = req.user.id;
        const newQuiz = await quiz_model_1.default.create({
            title,
            description,
            category,
            questions,
            settings,
            createdBy: userId,
        });
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: newQuiz,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error caused by ", error);
        }
        else {
            console.error("Unknown error: ", error);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while adding a quiz",
        });
    }
};
exports.createQuiz = createQuiz;
const getQuizById = async (req, res) => {
    try {
        const quiz = await quiz_model_1.default.findById(req.params.id);
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        res.json({
            success: true,
            data: quiz,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error caused by ", error);
        }
        else {
            console.error("Unknown error: ", error);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while finding quiz by id",
        });
    }
};
exports.getQuizById = getQuizById;
const deleteQuizById = async (req, res) => {
    try {
        const deleteQuiz = await quiz_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleteQuiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error caused by ", error);
        }
        else {
            console.error("Unknown error: ", error);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting quiz",
        });
    }
};
exports.deleteQuizById = deleteQuizById;
const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedQuiz = await quiz_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!updatedQuiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: updatedQuiz,
        });
    }
    catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update quiz",
        });
    }
};
exports.updateQuiz = updateQuiz;
//# sourceMappingURL=quiz.controller.js.map