import { Router } from "express";
import v1Routes from "./v1/index";

// Initialize Express router
const router = Router();

// API version v1 routes
router.use("/v1", v1Routes);

export default router;
