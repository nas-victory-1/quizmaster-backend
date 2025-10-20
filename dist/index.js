"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongodb_1 = require("./config/mongodb");
const user_routes_1 = __importDefault(require("./user/user.routes"));
const quiz_routes_1 = __importDefault(require("./quiz/quiz.routes"));
const session_routes_1 = __importDefault(require("./session/session.routes"));
const socketHandlers_1 = require("./socket/socketHandlers");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const security_middleware_1 = require("./middleware/security.middleware");
const logger_middleware_1 = require("./middleware/logger.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Socket.IO setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io = io;
// Security Middleware
app.use(security_middleware_1.securityMiddleware);
app.use(logger_middleware_1.requestLogger);
// CORS Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
// Rate limiting
app.use("/api/auth", rateLimit_middleware_1.authLimiter); // Stricter limits for auth
app.use("/api/", rateLimit_middleware_1.apiLimiter); // General API limits
// Database connection
(0, mongodb_1.connectToDb)();
// Enhanced health check
app.get("/api/health", (_req, res) => {
    res.json({
        status: "OK",
    });
});
// Routes
app.use("/api/auth", user_routes_1.default);
app.use("/api/quiz", quiz_routes_1.default);
app.use("/api/session", session_routes_1.default);
// 404 handler
app.use("/", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});
app.use(logger_middleware_1.errorLogger);
// Global error handler
app.use((error, req, res, next) => {
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
(0, socketHandlers_1.setupSocketHandlers)(io);
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
//# sourceMappingURL=index.js.map