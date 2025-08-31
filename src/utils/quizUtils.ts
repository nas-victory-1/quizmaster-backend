import QuizSessionModel from "../session/session.model";

export const generateUniqueCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code: string;
  let isUnique = false;
  
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code already exists
    const existingSession = await QuizSessionModel.findOne({ 
      code, 
      status: { $ne: 'finished' },
      expiresAt: { $gt: new Date() }
    });
    
    isUnique = !existingSession;
  } while (!isUnique);
  
  return code;
};

export const validateQuizCode = async (code: string): Promise<boolean> => {
  const session = await QuizSessionModel.findOne({
    code: code.toUpperCase(),
    status: { $in: ['waiting', 'active'] },
    expiresAt: { $gt: new Date() }
  });
  
  return !!session;
};

export const generateParticipantId = (): string => {
  return `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};