import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

// Middleware to handle 404 Not Found errors.
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = createHttpError(
    404,
    `We’re sorry, but the requested resource '${req.originalUrl}' was not found!`
  );
  next(error);
};

// Centralized Error Handling Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "An unexpected error occurred. Please try again later."
      : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    developerMessage: err.stack || "Unknown error",
  });
};
