const path = require("path");
const logUploadService = require("../services/logUpload.service");
const logParserService = require("../services/logParser.service");

async function postUpload(req, res, next) {
  try {
    const file = req.file ?? (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const id = path.parse(file.filename).name;
    const storedPath = file.path;

    let summary;
    try {
      summary = await logParserService.analyzeFile(storedPath);
    } catch (parseErr) {
      summary = {
        parseFailed: true,
        parseError: parseErr.message,
      };
    }

    const meta = await logUploadService.registerAnalysis({
      id,
      originalName: file.originalname,
      storedPath,
      size: file.size,
      createdAt: new Date().toISOString(),
      summary,
    });

    res.status(201).json({
      id: meta.id,
      originalName: meta.originalName,
      size: meta.size,
      createdAt: meta.createdAt,
      summary: meta.summary,
    });
  } catch (err) {
    next(err);
  }
}

async function getAnalysis(req, res, next) {
  try {
    const data = await logUploadService.getAnalysis(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getAnalyses(req, res, next) {
  try {
    const items = await logUploadService.listAnalyses();
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
}

module.exports = { postUpload, getAnalysis, getAnalyses };
