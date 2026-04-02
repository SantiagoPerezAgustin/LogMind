const path = require("path");

module.exports = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: path.resolve(
    process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads"),
  ),
  databaseUrl: process.env.DATABASE_URL || "",
};
