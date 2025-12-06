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

export default router;
