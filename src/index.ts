import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectToDb } from "./config/mongodb";
import userRoutes from "./user/user.routes";
import quizRoutes from "./quiz/quiz.routes";
import sessionRoutes from "./session/session.routes";
import { setupSocketHandlers } from "./socket/socketHandlers";
import { apiLimiter, authLimiter } from "./middleware/rateLimit.middleware";
import { securityMiddleware } from "./middleware/security.middleware";
import { requestLogger, errorLogger } from "./middleware/logger.middleware";

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Security Middleware
app.use(securityMiddleware);

app.use(requestLogger);

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
app.use("/api/auth", authLimiter); // Stricter limits for auth
app.use("/api/", apiLimiter); // General API limits

// Database connection
connectToDb();

// Enhanced health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
  });
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/session", sessionRoutes);

// 404 handler
app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorLogger);

// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", error);

  if (error.type === "entity.parse.failed") {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
