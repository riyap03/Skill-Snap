import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    skills: [String],
    date: String,
    link: String,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);