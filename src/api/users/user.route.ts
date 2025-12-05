import { Router } from "express";
import auth from "../../middlewares/auth";
import userControllers from "./user.controller";

// Initialize Express router
const router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    View all users in the system
 * @access  Admin only
 */
router.get("/", auth("admin"), userControllers.getAllUsers);

/**
 * @route   PUT /api/v1/users/:userId
 * @desc    Admin: Update any user's role or details
 *          Customer: Update own profile only
 * @access  Admin or Own
 */
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

/**
 * @route   DELETE /api/v1/users/:userId
 * @desc    Delete a user (only if no active bookings exist)
 * @access  Admin only
 */
router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export default router;
