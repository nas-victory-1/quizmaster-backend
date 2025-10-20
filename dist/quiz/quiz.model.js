"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const OptionsSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
});
const QuestionsSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
    timeLimit: {
        type: Number,
        default: 20,
    },
    options: {
        type: [OptionsSchema],
        validate: [optionArrayLimit, "At least 2 options required"],
    },
});
function optionArrayLimit(val) {
    return val.length >= 2;
}
function questionArrayLimit(val) {
    return val.length >= 1;
}
const SettingsSchema = new mongoose_1.default.Schema({
    leaderboard: {
        type: Boolean,
        default: true,
    },
    shuffle: {
        type: Boolean,
        default: false,
    },
    reviewAnswers: {
        type: Boolean,
        default: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
});
const QuizSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    questions: {
        type: [QuestionsSchema],
        validate: [questionArrayLimit, "At least 1 question required"],
    },
    settings: {
        type: SettingsSchema,
        default: {},
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
QuizSchema.index({ createdBy: 1 });
QuizSchema.index({ category: 1 });
QuizSchema.index({ createdAt: -1 });
const QuizModel = mongoose_1.default.model("Quiz", QuizSchema);
exports.default = QuizModel;
//# sourceMappingURL=quiz.model.js.map