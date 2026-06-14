import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["skill_test", "adaptive", "coding", "core"], required: true },
  track: String,
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  speedScore: { type: Number, default: 0 },
  level: { type: String, default: "beginner" },
  answers: [{ questionId: String, answerIndex: Number }],
  strongTopics: [{ type: String }],
  weakTopics: [{ type: String }],
  codingData: {
    challengeId: String,
    code: String,
    output: String,
    attempts: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    correct: { type: Boolean, default: false },
  },
}, { timestamps: true });

export default mongoose.model("AssessmentResult", assessmentResultSchema);
