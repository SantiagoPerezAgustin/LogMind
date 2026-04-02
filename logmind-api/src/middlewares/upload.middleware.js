const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const multer = require("multer");
const config = require("../config/config");
const allowedExt = /\.(log|txt)$/i;

const uploadDir = config.uploadDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const id = crypto.randomUUID();
    const ext = path.extname(file.originalname) || ".log";
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    if (allowedExt.test(ext)) {
      cb(null, true);
      return;
    }
    const err = new Error("Solo se permiten archivos .log o .txt");
    err.statusCode = 400;
    cb(err);
  },
});

module.exports = { upload };
