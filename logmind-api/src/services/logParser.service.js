const fs = require("fs");
const readline = require("readline");

/** Patrones simples; después los refinás por tipo de log */
const ERROR_LIKE = /\b(ERROR|FATAL|Exception|CRITICAL|Unhandled)\b/i;
const WARN_LIKE = /\b(WARN|WARNING)\b/i;

/**
 * Lee el archivo línea a línea (sin cargarlo entero en memoria).
 * @param {string} filePath
 * @returns {Promise<object>}
 */
async function analyzeFile(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let errorLineCount = 0;
  let warnLineCount = 0;
  const errorSamples = [];
  const maxSamples = 20;
  const frequency = new Map();

  for await (const line of rl) {
    lineCount++;
    if (ERROR_LIKE.test(line)) {
      errorLineCount++;
      const key = line.trim().slice(0, 300);
      frequency.set(key, (frequency.get(key) || 0) + 1);
      if (errorSamples.length < maxSamples) {
        errorSamples.push(line.trim());
      }
    } else if (WARN_LIKE.test(line)) {
      warnLineCount++;
    }
  }

  const topErrors = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([message, count]) => ({ message, count }));

  return {
    lineCount,
    errorLineCount,
    warnLineCount,
    topErrors,
    errorSamples,
  };
}

module.exports = { analyzeFile };
