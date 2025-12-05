import app from "./app";
import config from "./config";

// Start server
(async () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Server start failed:", err);
  }
})();
