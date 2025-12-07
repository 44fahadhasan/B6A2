import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import vehicleServices from "./vehicle.service";

const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    return sendResponse(res, {
      statusCode: 201,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    if (!result.length) {
      return sendResponse(res, {
        message: "No vehicles found",
        data: result,
      });
    }

    return sendResponse(res, {
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vehicleServices.getVehicle(req.params.vehicleId!);

    if (result === null) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "No vehicle found",
      });
    }

    return sendResponse(res, {
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body,
      params: { vehicleId },
    } = req;

    const result = await vehicleServices.updateVehicle(vehicleId!, body);

    if (result === null) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "No vehicle found",
      });
    }

    return sendResponse(res, {
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// todo:only if no active bookings exist
const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);

    if (result === true) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Cannot delete: active bookings exist",
      });
    }

    if (result === null) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Vehicle not found",
      });
    }

    return sendResponse(res, {
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};

export default vehicleControllers;
