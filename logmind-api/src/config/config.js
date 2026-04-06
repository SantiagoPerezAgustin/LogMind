const path = require("path");

module.exports = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: path.resolve(
    process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads"),
  ),
  databaseUrl: process.env.DATABASE_URL || "",
  /** Clave de https://console.mistral.ai/ (La Plateforme) */
  mistralApiKey: process.env.MISTRAL_API_KEY || "",
  /** Modelo Mistral (ej. mistral-small-latest, open-mistral-7b) */
  mistralModel: process.env.MISTRAL_MODEL || "mistral-small-latest",
  /** Origen permitido para CORS (front Vite por defecto) */
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
