import { IRouter, Router } from "express";
import authRoutes from "../../modules/auth/auth.route";
import bookingRoutes from "../../modules/bookings/booking.route";
import userRoutes from "../../modules/users/user.route";
import vehicleRoutes from "../../modules/vehicles/vehicle.route";

interface IModuleRoute {
  path: string;
  route: IRouter;
}

// Initialize Express router
const router = Router();

// Module Routes
const moduleRoutes: IModuleRoute[] = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/vehicles", route: vehicleRoutes },
  { path: "/bookings", route: bookingRoutes },
];

// Register all routes
moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
