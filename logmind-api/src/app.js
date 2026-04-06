const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const healthRoutes = require("./routes/health.routes");
const logRoutes = require("./routes/log.routes");
const errorHandler = require("./middlewares/errorHandler");

function createApp() {
  const app = express();
  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }),
  );
  app.use(express.json());
  app.use("/api", healthRoutes);
  app.use("/api", logRoutes);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
