"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
exports.securityMiddleware = [
    // Basic security headers
    (0, helmet_1.default)(),
    // Custom CSP
    (req, res, next) => {
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
        next();
    },
    // Prevent clickjacking
    (req, res, next) => {
        res.setHeader("X-Frame-Options", "DENY");
        next();
    },
    // Enable CORS with specific methods
    (req, res, next) => {
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    },
];
//# sourceMappingURL=security.middleware.js.map