const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEN_AI_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "The match score between 1 to 100 , indicating how well the candidate's profile matches the job description match based on the resume and self description provided by the candidate",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question asked during the interview"),
        intention: z
          .string()
          .describe("The intention behind asking the technical question"),
        answer: z
          .string()
          .describe("The candidate's answer to the technical question"),
      }),
    )
    .describe(
      "A list of technical questions that can be asked during the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question asked during the interview"),
        intention: z
          .string()
          .describe("The intention behind asking the behavioral question"),
        answer: z
          .string()
          .describe("The candidate's answer to the behavioral question"),
      }),
    )
    .describe(
      "A list of behavioral questions that can be asked during the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking based on the interview",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap"),
      }),
    )
    .describe(
      "A list of skill gaps that the candidate has based on the interview along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan,starting from 1"),
        focus: z
          .string()
          .describe("The main focus of the day in the preparation plan"),
        task: z
          .array(z.string())
          .describe(
            "A list of tasks to be completed on that day in the preparation plan",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow based on the interview report",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the  interview report is genrated.",
    ),
});

async function generateInterviewReport({ resume,selfDescription,jobDescription,}) {
  
  const prompt = `Generate an interview report based on the following details:\n
    Job Description: ${jobDescription}\n
    Resume: ${resume}\n
    Self Description: ${selfDescription}\n
    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    content: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = { generateInterviewReport };
