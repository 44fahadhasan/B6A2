import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import userServices from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.getAllUsers();

    return sendResponse(res, {
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      user,
      body,
      params: { userId },
    } = req;

    const result = await userServices.updateUser(userId!, user!, body);

    if (result === false) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Only admin can update the role",
      });
    }

    if (result === null) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    return sendResponse(res, {
      message: "User updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.deleteUser(req.params.userId!);

    if (result === null) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    return sendResponse(res, {
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};

export default userControllers;
