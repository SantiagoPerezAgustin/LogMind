const pool = require("../db/pool");

function rowToAnalysis(row) {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : row.created_at;
  return {
    id: row.id,
    originalName: row.original_name,
    storedPath: row.stored_path,
    size: row.size_bytes,
    createdAt,
    summary: row.summary,
  };
}

async function registerAnalysis(meta) {
  const result = await pool.query(
    `INSERT INTO analyses (id, original_name, stored_path, size_bytes, summary)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     RETURNING id, original_name, stored_path, size_bytes, created_at, summary`,
    [
      meta.id,
      meta.originalName,
      meta.storedPath,
      meta.size,
      JSON.stringify(meta.summary),
    ],
  );
  return rowToAnalysis(result.rows[0]);
}

async function getAnalysis(id) {
  const result = await pool.query(
    `SELECT id, original_name, stored_path, size_bytes, created_at, summary
     FROM analyses WHERE id = $1`,
    [id],
  );
  if (result.rows.length === 0) {
    return undefined;
  }
  return rowToAnalysis(result.rows[0]);
}

async function listAnalyses() {
  const result = await pool.query(
    `SELECT id, original_name, stored_path, size_bytes, created_at, summary
     FROM analyses
     ORDER BY created_at DESC`,
  );
  return result.rows.map(rowToAnalysis);
}

module.exports = { registerAnalysis, getAnalysis, listAnalyses };
