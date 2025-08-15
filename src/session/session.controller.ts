// routes/quiz.ts
import express, { Request, Response } from 'express';
import QuizSessionModel from './session.model';
import { generateUniqueCode, validateQuizCode, generateParticipantId } from '../utils/quizUtils';


// Create a new quiz session
export const createQuizSession = async(req:Request, res: Response):Promise<void> => {
  try {
    const { title, questions, creatorId } = req.body;
    const code = await generateUniqueCode();
    
    const quizSession = new QuizSessionModel({
      code: code.toUpperCase(),
      title,
      questions,
      creatorId,
      participants: [],
      status: 'waiting'
    });
    
    await quizSession.save();
    
    res.status(201).json({
      success: true,
      message: "Created session successfully",
      data: {
        sessionId: quizSession._id,
        code:quizSession.code,
        title:quizSession.title
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create quiz session'
    });
  }
};

// Join a quiz with code
export const joinQuiz = async(req:Request, res: Response):Promise<void> => {
  try {
    const { code, participantName } = req.body;
    
    if (!code || !participantName) {
      res.status(400).json({
        success: false,
        message: 'Code and participant name are required'
      });
      return;
    }
    
    const isValidCode = await validateQuizCode(code);
    if (!isValidCode) {
      res.status(404).json({
        success: false,
        message: 'Invalid or expired quiz code'
      });
      return
    }
    
    const participantId = generateParticipantId();
    
    const session = await QuizSessionModel.findOneAndUpdate(
      { 
        code: code.toUpperCase(),
        status: { $in: ['waiting', 'active'] }
      },
      {
        $push: {
          participants: {
            id: participantId,
            name: participantName,
            joinedAt: new Date(),
            score: 0
          }
        }
      },
      { new: true }
    );
    
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        participantId,
        quizTitle: session.title,
        status: session.status,
        participantCount: session.participants.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to join quiz'
    });
  }
};

// Get quiz session info
export const getSessionInfo =  async (req:Request, res:Response):Promise<void> => {
  try {
    const { code } = req.params;
    
    const session = await QuizSessionModel.findOne({
      code: code.toUpperCase(),
      expiresAt: { $gt: new Date() }
    });
    
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
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
        totalQuestions: session.questions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz session'
    });
  }
};

// Start quiz (for quiz creator)
export const startQuiz = async (req:Request, res:Response):Promise<void> => {
  try {
    const { sessionId } = req.params;
    
    const session = await QuizSessionModel.findByIdAndUpdate(
      sessionId,
      { status: 'active' },
      { new: true }
    );
    
    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: "Quiz started",
      data: { status: 'active' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start quiz'
    });
  }
};
