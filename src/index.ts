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

// ✅ Allow both deployed frontend and localhost for development
const allowedOrigins = [
  process.env.CLIENT_URL, // your deployed frontend (from .env)
  "http://localhost:3000", // for local testing
].filter(Boolean);

// ✅ CORS setup for both REST and Socket.IO
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Essential middleware
app.use(securityMiddleware);
app.use(requestLogger);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Rate limiting
app.use("/api/auth", authLimiter);
app.use("/api/", apiLimiter);

// ✅ Connect to DB
connectToDb();

// ✅ Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

// ✅ API routes
app.use("/api/auth", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/session", sessionRoutes);

// ✅ 404 handler
app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ✅ Error loggers and global handler
app.use(errorLogger);
app.use((error: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", error);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ✅ Socket handlers
setupSocketHandlers(io);

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => console.log("Process terminated"));
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
