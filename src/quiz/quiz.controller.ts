import { Request, Response } from "express";
import QuizModel from "./quiz.model";

export const getAllQuizzes = async(req:Request, res:Response):Promise<void> =>{
    try {
        const quizzes = await QuizModel.find();
        res.status(200).json({
            success: true,
            message: "All quizzes retrieved successfully",
            data: quizzes
        });

    } catch (error:unknown) {
        if(error instanceof Error){
            console.error("Error caused by ", error);
        }else{
            console.error("Unknown error: ", error)
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while retrieving all quizzes"
        });
    }
}

export const createQuiz = async(req:Request, res: Response):Promise<void> => {
    try {
        const { title, description, category, questions, settings } = req.body;

        const newQuiz = await QuizModel.create({
            title,
            description,
            category,
            questions,
            settings
        })
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: newQuiz
        })
        
        
    } catch (error:unknown) {
        if(error instanceof Error){
            console.error("Error caused by ", error);
        }else{
            console.error("Unknown error: ", error) 
        }
        res
        .status(500)
        .json({
            success: false,
            message: "Internal server error while adding a quiz"
        })
    }

}

export const getQuizById = async(req:Request, res:Response):Promise<void> =>{
    try {
        const quiz = await QuizModel.findById(req.params.id);
        if (!quiz){
            res.status(404).json({ 
                success: false,
                message: "Quiz not found" });
        }
        res.json(quiz);
       
    } catch (error) {
        if(error instanceof Error){
            console.error("Error caused by ", error);
        }else{
            console.error("Unknown error: ", error)
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while finding quiz by id"
        })
    }
}

export const deleteQuizById = async(req:Request, res:Response):Promise<void> =>{
    try {
        const deleteQuiz = await QuizModel.findByIdAndDelete(req.params.id);
        if(!deleteQuiz){
            res.status(404).json({
                success: false,
                message: "Quiz not found" });
        }
        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        if(error instanceof Error){
            console.error("Error caused by ", error);
        }else{
            console.error("Unknown error: ", error)
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting quiz"
        })
    } 
}

export const updateQuiz = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update the quiz
    const updatedQuiz = await QuizModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true } // Returns the updated document
    );

    if (!updatedQuiz) {
        res.status(404).json({
            success:false,
            message: 'Quiz not found' });
    }
    res.status(200).json(updatedQuiz);

  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ 
        success:false,
        message: 'Failed to update quiz' });
  }
};