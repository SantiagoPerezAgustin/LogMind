const express = require("express");
const { upload } = require("../middlewares/upload.middleware");
const logUploadController = require("../controllers/logUpload.controller");

const router = express.Router();

router.post("/logs", upload.array("file", 5), logUploadController.postUpload);
router.get("/analyses", logUploadController.getAnalyses);
router.get("/analyses/:id", logUploadController.getAnalysis);

module.exports = router;
