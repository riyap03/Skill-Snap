import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
    },

    hasTakenTest: {
      type: Boolean,
      default: false,
    },

    learningProfile: {
      level: {
        type: String,
        default: "beginner",
      },
      accuracyScore: {
        type: Number,
        default: 0,
      },
      speedScore: {
        type: Number,
        default: 0,
      },
      currentRole: {
        type: String,
        default: "",
      },
      targetRole: {
        type: String,
        default: "",
      },
      knownSkills: {
        type: [String],
        default: [],
      },
      weeklyStudyHours: {
        type: Number,
        default: 10,
      },
      learningStyle: {
        type: String,
        default: "",
      },
      onboardingCompleted: {
        type: Boolean,
        default: false,
      },
    },

    completedSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
