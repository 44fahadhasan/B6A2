import express, { Request, Response } from "express";
import config from "./config";

// Initialize Express App
const app = express();

// Routes
app.get("/", (req: Request, res: Response) =>
  res.send(`${config.site_name} is running`)
); // Health check

export default app;
