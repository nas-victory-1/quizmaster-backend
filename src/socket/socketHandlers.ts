import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import QuizSessionModel from "../session/session.model";

// Store active sessions and their participants
const activeSessions = new Map<string, Set<string>>();

// Authentication middleware for sockets
const authenticateSocket = (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    if (!process.env.SECRET_KEY) {
      return next(new Error("Server configuration error"));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY) as {
      id: string;
      email: string;
    };
    socket.data.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

// Verify creator ownership
const verifyCreator = async (
  sessionId: string,
  userId: string
): Promise<boolean> => {
  try {
    const session = await QuizSessionModel.findById(sessionId);
    return session ? session.creatorId === userId : false;
  } catch (error) {
    return false;
  }
};

export const setupSocketHandlers = (io: Server) => {
  io.use(authenticateSocket);

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id, socket.data.user.email);

    // Join a quiz session room with authentication
    socket.on(
      "join-quiz-room",
      async (data: {
        sessionId: string;
        participantId?: string;
        participantName?: string;
        isCreator?: boolean;
      }) => {
        try {
          const { sessionId, participantId, participantName, isCreator } = data;

          // Verify creator ownership if claiming to be creator
          if (isCreator) {
            const isActualCreator = await verifyCreator(
              sessionId,
              socket.data.user.id
            );
            if (!isActualCreator) {
              socket.emit("error", { message: "Not authorized as creator" });
              return;
            }
          }

          console.log(
            `User ${socket.id} joining room ${sessionId} as ${
              isCreator ? "creator" : "participant"
            }`
          );

          socket.join(sessionId);
          socket.data.sessionId = sessionId;
          socket.data.participantId = participantId;
          socket.data.participantName = participantName;
          socket.data.isCreator = isCreator;

          // Update active sessions
          if (!activeSessions.has(sessionId)) {
            activeSessions.set(sessionId, new Set());
          }

          if (participantId) {
            activeSessions.get(sessionId)!.add(participantId);
          }

          const participantCount = activeSessions.get(sessionId)!.size;

          if (!isCreator && participantId) {
            socket.to(sessionId).emit("participant-joined", {
              participantId,
              participantName,
              participantCount,
            });
          }

          io.to(sessionId).emit("participant-count-update", {
            participantCount,
          });

          console.log(
            `Room ${sessionId} now has ${participantCount} participants`
          );
        } catch (error) {
          socket.emit("error", { message: "Failed to join room" });
        }
      }
    );

    // Start quiz (creator only) with verification
    socket.on("start-quiz", async (data: { sessionId: string }) => {
      try {
        const { sessionId } = data;

        const isCreator = await verifyCreator(sessionId, socket.data.user.id);
        if (!isCreator) {
          socket.emit("error", {
            message: "Only quiz creator can start the quiz",
          });
          return;
        }

        console.log(`Starting quiz for session ${sessionId}`);
        io.to(sessionId).emit("quiz-started", {
          sessionId,
          timestamp: Date.now(),
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to start quiz" });
      }
    });
    // Send next question (creator only)
    socket.on(
      "next-question",
      (data: {
        sessionId: string;
        question: any;
        questionIndex: number;
        timeLimit: number;
      }) => {
        const { sessionId, question, questionIndex, timeLimit } = data;

        if (socket.data.isCreator) {
          console.log(
            `Sending question ${questionIndex} for session ${sessionId}`
          );
          io.to(sessionId).emit("new-question", {
            question,
            questionIndex,
            timeLimit,
            timestamp: Date.now(),
          });
        }
      }
    );

    // Handle participant answers
    socket.on(
      "submit-answer",
      (data: {
        sessionId: string;
        participantId: string;
        questionIndex: number;
        answer: any;
        timeToAnswer: number;
      }) => {
        const {
          sessionId,
          participantId,
          questionIndex,
          answer,
          timeToAnswer,
        } = data;

        console.log(
          `Answer received from ${participantId} for question ${questionIndex}`
        );

        // Broadcast to quiz creator and other participants if needed
        socket.to(sessionId).emit("answer-received", {
          participantId,
          questionIndex,
          answer,
          timeToAnswer,
          timestamp: Date.now(),
        });
      }
    );

    // Show results (creator only)
    socket.on("show-results", (data: { sessionId: string; results: any }) => {
      const { sessionId, results } = data;

      if (socket.data.isCreator) {
        console.log(`Showing results for session ${sessionId}`);
        io.to(sessionId).emit("results-ready", {
          results,
          timestamp: Date.now(),
        });
      }
    });

    // End quiz (creator only)
    socket.on("end-quiz", (data: { sessionId: string }) => {
      const { sessionId } = data;

      if (socket.data.isCreator) {
        console.log(`Ending quiz for session ${sessionId}`);
        io.to(sessionId).emit("quiz-ended", {
          sessionId,
          timestamp: Date.now(),
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const sessionId = socket.data.sessionId;
      const participantId = socket.data.participantId;
      const isCreator = socket.data.isCreator;

      if (sessionId && activeSessions.has(sessionId)) {
        // Remove participant from active session if they had a participantId
        if (participantId) {
          activeSessions.get(sessionId)!.delete(participantId);

          const participantCount = activeSessions.get(sessionId)!.size;

          // Notify others about participant leaving
          socket.to(sessionId).emit("participant-left", {
            participantId,
            participantCount,
          });

          // Update participant count for everyone
          socket.to(sessionId).emit("participant-count-update", {
            participantCount,
          });

          console.log(
            `Participant ${participantId} left session ${sessionId}. ${participantCount} remaining.`
          );
        }

        // If creator disconnects, notify participants
        if (isCreator) {
          socket.to(sessionId).emit("creator-disconnected", {
            sessionId,
          });
        }

        // Clean up empty sessions
        if (activeSessions.get(sessionId)!.size === 0) {
          console.log(`Cleaning up empty session ${sessionId}`);
          activeSessions.delete(sessionId);
        }
      }
    });

    // Get session info
    socket.on("get-session-info", (data: { sessionId: string }) => {
      const { sessionId } = data;
      const participantCount = activeSessions.has(sessionId)
        ? activeSessions.get(sessionId)!.size
        : 0;

      socket.emit("session-info", {
        sessionId,
        participantCount,
        isActive: activeSessions.has(sessionId),
      });
    });
  });

  // Cleanup inactive sessions periodically (every 30 minutes)
  setInterval(() => {
    console.log(`Active sessions: ${activeSessions.size}`);
    // You could add more sophisticated cleanup logic here
  }, 30 * 60 * 1000);
};
