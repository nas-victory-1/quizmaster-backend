import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    options:{
        type:[String],
        required: true
    },
    correctAnswer:{
        type: Number,
        required: true
    },

},{
    timestamps: true
})

const QuizModel = mongoose.model('Quiz', QuizSchema);
export default QuizModel;