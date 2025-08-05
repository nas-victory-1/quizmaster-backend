import mongoose from "mongoose";


const OptionsSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    correctAnswer:{
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
        validate: [arrayLimit, "At least 2 options required"]
    }
})

function arrayLimit(val: any[]) {
  return val.length >= 2;
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
        validate: [arrayLimit, "At least 1 question required"],
    },
    settings:{
        type: [SettingsSchema],
        default: {},
    }

},{
    timestamps: true
})

const QuizModel = mongoose.model('Quiz', QuizSchema);
export default QuizModel;