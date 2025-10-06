import { Response } from "express";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const sendSuccess = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200
): void => {
  const response: ApiResponse = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  error?: any,
  statusCode: number = 500
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: error?.message || error,
  };
  res.status(statusCode).json(response);
};
