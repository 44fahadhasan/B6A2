import { IRouter, Router } from "express";
import authRoutes from "../../api/auth/auth.route";

interface IModuleRoute {
  path: string;
  route: IRouter;
}

// Initialize Express router
const router = Router();

// Module Routes
const moduleRoutes: IModuleRoute[] = [{ path: "/auth", route: authRoutes }];

// Register all routes
moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
