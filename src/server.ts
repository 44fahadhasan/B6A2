import app from "./app";
import config from "./config";
import initDB from "./config/db";

// Start server
(async () => {
  try {
    // Initialize DB
    initDB();

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Server start failed:", err);
  }
})();
