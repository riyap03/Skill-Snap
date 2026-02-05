import mongoose from "mongoose";



const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: String,
  score: Number,
  totalQuestions: Number,
  timeTaken: Number, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Progress", progressSchema);
