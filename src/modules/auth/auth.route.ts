import { Router } from "express";
import { loginController, signupController } from "./auth.controller";

// Initialize Express router
const router = Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user account
 * @access  Public
 */
router.post("/signup", signupController);

/**
 * @route   POST /api/v1/auth/signin
 * @desc    Login and receive JWT authentication token
 * @access  Public
 */
router.post("/signin", loginController);

export default router;
