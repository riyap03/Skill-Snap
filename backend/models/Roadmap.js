import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  completed: Boolean,
  completedAt: Date,
  history: [{ status: Boolean, date: Date }],
});

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roadmapName: String,
  skills: { type: Map, of: skillSchema },
});

export default mongoose.model("Roadmap", roadmapSchema);
