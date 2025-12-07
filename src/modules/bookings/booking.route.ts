import { Router } from "express";
import auth from "../../middlewares/auth";
import bookingControllers from "./booking.controller";

// Initialize Express router
const router = Router();

/**
 * @route   POST /api/v1/bookings
 * @desc    Create a new booking with automatic price calculation and vehicle status update
 * @access  Customer or Admin
 */
router.post("/", auth("customer", "admin"), bookingControllers.createBooking);

/**
 * @route   GET /api/v1/bookings
 * @desc    Retrieve bookings based on user role
 * @access  Role-based (Admin sees all, Customer sees own)
 */
router.get("/", auth("customer", "admin"), bookingControllers.getAllBookings);

/**
 * @route   PUT /api/v1/bookings/:bookingId
 * @desc    Update booking status based on user role and business rules
 * @access  Role-based
 */
router.put(
  "/:bookingId",
  auth("customer", "admin"),
  bookingControllers.updateBooking
);

export default router;
