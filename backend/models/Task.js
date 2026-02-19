import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    start: Date,
    end: Date,
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },
    hoursLogged: Number,
    logs: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        start: Date,
        end: Date,
        duration: Number,
        note: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
