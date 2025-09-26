import mongoose, { Schema } from "mongoose";


const OptionsSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    isCorrect:{
        type: Boolean,
        required: true
    },
})

const QuestionsSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    timeLimit:{
        type: Number,
        default: 20
    },
    options:{
        type: [OptionsSchema],
        validate: [optionArrayLimit, "At least 2 options required"]
    }
})

function optionArrayLimit(val: any[]) {
  return val.length >= 2;
}

function questionArrayLimit(val: any[]) {
  return val.length >= 1;
}

const SettingsSchema = new mongoose.Schema({
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

const QuizSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
    },
    category:{
        type: String,
    },
    questions: {
        type: [QuestionsSchema],
        validate: [questionArrayLimit, "At least 1 question required"],
    },
    settings:{
        type: SettingsSchema,
        default: {},
    },
    createdBy:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }

},{
    timestamps: true
})

const QuizModel = mongoose.model('Quiz', QuizSchema);
export default QuizModel;