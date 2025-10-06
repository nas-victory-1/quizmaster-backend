import QuizSessionModel from "../session/session.model";
import crypto from "crypto";

export const generateUniqueCode = async (): Promise<string> => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code: string;
  let isUnique = false;
  let attempts = 0;

  do {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    attempts++;
    console.log(`Attempt ${attempts}: Generated code ${code}`);

    // Check if code already exists
    const existingSession = await QuizSessionModel.findOne({
      code,
      status: { $ne: "finished" },
      expiresAt: { $gt: new Date() },
    });

    console.log(`Existing session found:`, existingSession ? "YES" : "NO");
    isUnique = !existingSession;
    console.log(`Is unique:`, isUnique);
  } while (!isUnique);

  console.log(`Final code: ${code}`);
  return code;
};

export const validateQuizCode = async (code: string): Promise<boolean> => {
  const session = await QuizSessionModel.findOne({
    code: code.toUpperCase(),
    status: { $in: ["waiting", "active"] },
    expiresAt: { $gt: new Date() },
  });

  return !!session;
};

export const generateParticipantId = (): string => {
  return `participant_${crypto.randomUUID()}`;
};
