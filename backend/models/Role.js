import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    permissions: [{ type: String }],
  },
  { timestamps: true },
);

roleSchema.index({ name: 1, organization: 1 }, { unique: true });

export default mongoose.model("Role", roleSchema);
