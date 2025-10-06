import mongoose, { Schema, Document } from "mongoose";

export interface IQuizSession extends Document {
  code: string;
  title: string;
  creatorId: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    timeLimit?: number;
  }>;
  participants: Array<{
    id: string;
    name: string;
    joinedAt: Date;
    score: number;
  }>;
  status: "waiting" | "active" | "finished";
  currentQuestionIndex: number;
  createdAt: Date;
  expiresAt: Date;
}

const QuizSessionSchema = new Schema<IQuizSession>({
  code: {
    type: String,
    required: true,
    unique: true, // already creates an index
    length: 6,
  },
  title: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
      timeLimit: { type: Number, default: 30 },
    },
  ],
  participants: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now },
      score: { type: Number, default: 0 },
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
});

// ✅ Keep only unique, non-duplicate indexes
QuizSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
QuizSessionSchema.index({ creatorId: 1 });
QuizSessionSchema.index({ status: 1 });
QuizSessionSchema.index({ createdAt: -1 });

const QuizSessionModel = mongoose.model<IQuizSession>(
  "QuizSession",
  QuizSessionSchema
);

export default QuizSessionModel;
