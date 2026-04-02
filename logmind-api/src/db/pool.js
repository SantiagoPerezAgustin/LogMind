const { Pool } = require("pg");
const config = require("../config/config");

if (!config.databaseUrl) {
  throw new Error(
    "Falta DATABASE_URL en .env (ej. postgresql://postgres:TU_CLAVE@localhost:5432/logmind)",
  );
}

const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
});

module.exports = pool;
