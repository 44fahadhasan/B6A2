import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { login, signup } from "./auth.service";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await signup(req.body);

    if (result === true) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "User already registered",
      });
    }

    return sendResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await login(req.body);

    if (!result) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid credentials",
      });
    }

    return sendResponse(res, {
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
