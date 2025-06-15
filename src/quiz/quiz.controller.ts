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

export const addQuiz = async(req:Request, res: Response):Promise<void> => {
    try {
        const { question, options, correctAnswer } = req.body;
        
        
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