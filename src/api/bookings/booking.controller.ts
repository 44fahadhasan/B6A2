import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import bookingServices from "./booking.service";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    return sendResponse(res, {
      statusCode: 201,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const bookingControllers = { createBooking };

export default bookingControllers;
