const healthService = require("../services/health.service");

function getHealth(req, res, next) {
  try {
    const data = healthService.getStatus();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getHealth };
