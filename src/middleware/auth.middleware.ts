import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// Define JWT error types
interface JwtError extends Error {
  name: "JsonWebTokenError" | "TokenExpiredError";
}

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers?.authorization;

    // Only support Authorization header for now (localStorage strategy)
    const accessToken =
      authHeader && authHeader.startsWith("Bearer")
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

    const jwtUser = jwt.verify(accessToken, process.env.SECRET_KEY) as {
      id: string;
      email: string;
    };

    if (!jwtUser || !jwtUser.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Invalid token payload.",
      });
      return;
    }

    (req as any).user = { id: jwtUser.id, email: jwtUser.email };
    next();
  } catch (error) {
    console.error("Authorization error:", error);

    const jwtError = error as JwtError;

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

export default authorization;
