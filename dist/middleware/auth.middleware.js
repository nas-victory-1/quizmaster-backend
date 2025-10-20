"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authorization = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        // Only support Authorization header for now (localStorage strategy)
        const accessToken = authHeader && authHeader.startsWith("Bearer")
            ? authHeader.split(" ")[1]
            : null;
        if (!accessToken) {
            res.status(401).json({
                success: false,
                message: "Unauthorized, no access token provided.",
            });
            return;
        }
        if (!process.env.SECRET_KEY) {
            res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
            return;
        }
        const jwtUser = jsonwebtoken_1.default.verify(accessToken, process.env.SECRET_KEY);
        if (!jwtUser || !jwtUser.id) {
            res.status(401).json({
                success: false,
                message: "Unauthorized. Invalid token payload.",
            });
            return;
        }
        req.user = { id: jwtUser.id, email: jwtUser.email };
        next();
    }
    catch (error) {
        console.error("Authorization error:", error);
        const jwtError = error;
        if (jwtError.name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: "Unauthorized. Token is invalid.",
            });
            return;
        }
        if (jwtError.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                message: "Unauthorized. Token is expired.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error during authorization",
        });
        return;
    }
};
exports.default = authorization;
//# sourceMappingURL=auth.middleware.js.map