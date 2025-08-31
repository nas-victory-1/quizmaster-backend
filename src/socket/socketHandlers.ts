// socket/socketHandlers.ts
import { Server, Socket } from 'socket.io';

// Store active sessions and their participants
const activeSessions = new Map<string, Set<string>>();

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join a quiz session room
    socket.on('join-quiz-room', (data: {
      sessionId: string;
      participantId?: string;
      participantName?: string;
      isCreator?: boolean;
    }) => {
      const { sessionId, participantId, participantName, isCreator } = data;
      
      console.log(`User ${socket.id} joining room ${sessionId} as ${isCreator ? 'creator' : 'participant'}`);
      
      socket.join(sessionId);
      socket.data.sessionId = sessionId;
      socket.data.participantId = participantId;
      socket.data.participantName = participantName;
      socket.data.isCreator = isCreator;

      // Update active sessions
      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, new Set());
      }

      // Only add to participant count if they have a participantId (real participants)
      if (participantId) {
        activeSessions.get(sessionId)!.add(participantId);
      }

      const participantCount = activeSessions.get(sessionId)!.size;

      // Notify others in the room about new participant (if not creator and has participantId)
      if (!isCreator && participantId) {
        socket.to(sessionId).emit('participant-joined', {
          participantId,
          participantName,
          participantCount
        });
      }

      // Send current participant count to everyone in the room
      io.to(sessionId).emit('participant-count-update', {
        participantCount
      });

      console.log(`Room ${sessionId} now has ${participantCount} participants`);
    });

    // Start quiz (creator only)
    socket.on('start-quiz', (data: { sessionId: string }) => {
      const { sessionId } = data;
      console.log(`Quiz start requested for session ${sessionId} by ${socket.id}`);
      
      if (socket.data.isCreator) {
        console.log(`Starting quiz for session ${sessionId}`);
        io.to(sessionId).emit('quiz-started', {
          sessionId,
          timestamp: Date.now()
        });
      } else {
        console.log(`Non-creator ${socket.id} tried to start quiz`);
      }
    });

    // Send next question (creator only)
    socket.on('next-question', (data: {
      sessionId: string;
      question: any;
      questionIndex: number;
      timeLimit: number;
    }) => {
      const { sessionId, question, questionIndex, timeLimit } = data;
      
      if (socket.data.isCreator) {
        console.log(`Sending question ${questionIndex} for session ${sessionId}`);
        io.to(sessionId).emit('new-question', {
          question,
          questionIndex,
          timeLimit,
          timestamp: Date.now()
        });
      }
    });

    // Handle participant answers
    socket.on('submit-answer', (data: {
      sessionId: string;
      participantId: string;
      questionIndex: number;
      answer: any;
      timeToAnswer: number;
    }) => {
      const { sessionId, participantId, questionIndex, answer, timeToAnswer } = data;
      
      console.log(`Answer received from ${participantId} for question ${questionIndex}`);
      
      // Broadcast to quiz creator and other participants if needed
      socket.to(sessionId).emit('answer-received', {
        participantId,
        questionIndex,
        answer,
        timeToAnswer,
        timestamp: Date.now()
      });
    });

    // Show results (creator only)
    socket.on('show-results', (data: {
      sessionId: string;
      results: any;
    }) => {
      const { sessionId, results } = data;
      
      if (socket.data.isCreator) {
        console.log(`Showing results for session ${sessionId}`);
        io.to(sessionId).emit('results-ready', {
          results,
          timestamp: Date.now()
        });
      }
    });

    // End quiz (creator only)
    socket.on('end-quiz', (data: { sessionId: string }) => {
      const { sessionId } = data;
      
      if (socket.data.isCreator) {
        console.log(`Ending quiz for session ${sessionId}`);
        io.to(sessionId).emit('quiz-ended', {
          sessionId,
          timestamp: Date.now()
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      const sessionId = socket.data.sessionId;
      const participantId = socket.data.participantId;
      const isCreator = socket.data.isCreator;

      if (sessionId && activeSessions.has(sessionId)) {
        // Remove participant from active session if they had a participantId
        if (participantId) {
          activeSessions.get(sessionId)!.delete(participantId);
          
          const participantCount = activeSessions.get(sessionId)!.size;
          
          // Notify others about participant leaving
          socket.to(sessionId).emit('participant-left', {
            participantId,
            participantCount
          });

          // Update participant count for everyone
          socket.to(sessionId).emit('participant-count-update', {
            participantCount
          });

          console.log(`Participant ${participantId} left session ${sessionId}. ${participantCount} remaining.`);
        }

        // If creator disconnects, notify participants
        if (isCreator) {
          socket.to(sessionId).emit('creator-disconnected', {
            sessionId
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
    socket.on('get-session-info', (data: { sessionId: string }) => {
      const { sessionId } = data;
      const participantCount = activeSessions.has(sessionId) 
        ? activeSessions.get(sessionId)!.size 
        : 0;

      socket.emit('session-info', {
        sessionId,
        participantCount,
        isActive: activeSessions.has(sessionId)
      });
    });
  });

  // Cleanup inactive sessions periodically (every 30 minutes)
  setInterval(() => {
    console.log(`Active sessions: ${activeSessions.size}`);
    // You could add more sophisticated cleanup logic here
  }, 30 * 60 * 1000);
};