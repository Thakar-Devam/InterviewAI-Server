const { default: pdfParse } = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

async function genrateInterViewReportController(req, res) {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: "Resume PDF is required"
      });
    }

    // Parse PDF
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const resumeContent = pdfData.text;

    // Validate extracted text
    if (!resumeContent || resumeContent.trim().length === 0) {
      return res.status(400).json({
        message: "Could not extract text from PDF",
        error: "Empty PDF content - ensure PDF contains readable text"
      });
    }

    const { selfDescription, jobDescription } = req.body;

    // Validate required fields
    if (!selfDescription?.trim() || !jobDescription?.trim()) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "selfDescription and jobDescription are required"
      });
    }

    console.log("✅ PDF parsed successfully");
    console.log("Resume length:", resumeContent.length);

    const interviewReportByAI = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAI,
    });

    res.status(200).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ 
      message: "Error processing PDF", 
      error: error.message 
    });
  }
}


async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findById({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  res.status(200).json({
    message: "Interview report fetched sucessfully",
    interviewReport,
  });
}

async function getAllInterviewReportController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched sucessfully",
    interviewReports,
  });
}

module.exports = {
  genrateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportController,
};