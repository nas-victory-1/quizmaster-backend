import helmet from "helmet";
import { Request, Response, NextFunction } from "express";

export const securityMiddleware = [
  // Basic security headers
  helmet(),

  // Custom CSP
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    );
    next();
  },

  // Prevent clickjacking
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
  },

  // Enable CORS with specific methods
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  },
];
