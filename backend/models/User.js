import mongoose from "mongoose";
import bcrypt from "bcrypt";

const membershipSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  // additional membership-specific fields can go here
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    // a user can be superadmin or have memberships in orgs
    isSuperAdmin: { type: Boolean, default: false },
    memberships: [membershipSchema],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
