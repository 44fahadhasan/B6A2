import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

/**
 * Central config object
 */
export default {
  // App
  port: process.env.PORT || 5000,
  site_name: process.env.SITE_NAME || "Server",
};
