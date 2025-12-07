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

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    const result = await bookingServices.getAllBookings(user!);

    const message =
      user?.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    return sendResponse(res, {
      message,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      user,
      body: { status },
      params: { bookingId },
    } = req;

    const result = await bookingServices.updateBooking(
      bookingId!,
      status,
      user!
    );

    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    return sendResponse(res, {
      message,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};

export default bookingControllers;
