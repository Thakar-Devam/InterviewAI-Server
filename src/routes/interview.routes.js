const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewRouter = express.Router();
const interviewController = require("../controllers/interview.controllers")
const upload = require("../middleware/file.middleware")

interviewRouter.post("/", authMiddleware.authUser,upload.single('resume'),interviewController.genrateInterViewReportController);
interviewRouter.get("/report/:interviewId", authMiddleware.authUser,interviewController.getInterviewReportByIdController);
interviewRouter.get("/", authMiddleware.authUser,interviewController.getAllInterviewReportController);

module.exports = interviewRouter;
