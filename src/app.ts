import express, { Request, Response } from "express";
import config from "./config";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import router from "./routes";

// Initialize Express App
const app = express();

// Parse JSON
app.use(express.json());

// Health route
app.get("/", (req: Request, res: Response) =>
  res.send(`${config.site_name} is running`)
);

// Routes
app.use("/api", router);

// 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
