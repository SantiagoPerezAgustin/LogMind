function getStatus() {
  return {
    status: "ok",
    service: "logmind-api",
    timestamp: new Date().toISOString(),
  };
}
module.exports = { getStatus };
