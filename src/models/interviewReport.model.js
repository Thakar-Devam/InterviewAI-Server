const mongoose = require("mongoose");

const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preprationPlanSchema = new mongoose.Schema({
  day: { type: Number, required: [true, "Day is required"] },
  focus: { type: String, required: [true, "Focus is required"] },
  task: [
    {
      type: String,
      required: [true, "Task is required"],
    },
  ],
});

const interviewReportModel = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job Description is required"],
    },
    resume: { type: String },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preprationPlanSchema],
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
    }
  },
  {
    timestamps: true,
  },
);

const InterviewReportModel = mongoose.model(
  "interviewReport",
  interviewReportModel,
);
module.exports = InterviewReportModel;
