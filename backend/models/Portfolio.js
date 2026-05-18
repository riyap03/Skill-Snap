import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  skills: [String],

  date: String,

  link: String,
});
const portfolioSchema = new mongoose.Schema(
  {
    userId: {
           type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
      
    },

    projects: [projectSchema],

    aiContent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Portfolio",
  portfolioSchema
);