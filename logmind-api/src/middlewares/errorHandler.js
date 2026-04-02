function errorHandler(err, req, res, next) {
  console.error(err);
  let status = err.statusCode || err.status || 500;
  if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
  } else if (typeof err.code === "string" && err.code.startsWith("LIMIT_")) {
    status = 400;
  }
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}
module.exports = errorHandler;
