import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    date: { type: Date, required: true },
    entries: [
      {
        type: {
          type: String,
          enum: ["office", "home", "remote", "other"],
          default: "office",
        },
        start: Date,
        end: Date,
        note: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Attendance", attendanceSchema);
