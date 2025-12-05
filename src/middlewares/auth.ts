import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import sendResponse from "../utils/sendResponse";

// Authentication & Authorization Middleware
const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, {
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      const token = authHeader.split(" ")[1] as string;

      const decoded = jwt.verify(
        token,
        config.jwt.token_secret as string
      ) as JwtPayload;

      // Attach decoded user info to request
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role as string)) {
        return sendResponse(res, {
          statusCode: 403,
          message: "Forbidden",
        });
      }

      next();
    } catch (error) {
      console.error("JWT token error:", (error as Error).message);
      return sendResponse(res, {
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  };
};

export default auth;
