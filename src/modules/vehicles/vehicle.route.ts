import { Router } from "express";
import auth from "../../middlewares/auth";
import vehicleControllers from "./vehicle.controller";

// Initialize Express router
const router = Router();

/**
 * @route   POST /api/v1/vehicles
 * @desc    Add a new vehicle to the system
 * @access  Admin only
 */
router.post("/", auth("admin"), vehicleControllers.createVehicle);

/**
 * @route   GET /api/v1/vehicles
 * @desc    Retrieve all vehicles in the system
 * @access  Public
 */
router.get("/", vehicleControllers.getAllVehicles);

/**
 * @route   GET /api/v1/vehicles/:vehicleId
 * @desc    Retrieve specific vehicle details
 * @access  Public
 */
router.get("/:vehicleId", vehicleControllers.getVehicle);

/**
 * @route   PUT /api/v1/vehicles/:vehicleId
 * @desc    Update vehicle details, price, or availability status
 * @access  Admin only
 */
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

/**
 * @route   DELETE /api/v1/vehicles/:vehicleId
 * @desc    Delete a vehicle (only if no active bookings exist)
 * @access  Admin only
 */
router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export default router;
