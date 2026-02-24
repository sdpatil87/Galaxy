import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String },
    // organization-wide settings
    settings: {
      defaultTheme: { type: String, enum: ["light", "dark"], default: "light" },
      allowSelfRegistration: { type: Boolean, default: true },
    },
    // more org-wide settings can be added later
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Organization", organizationSchema);
