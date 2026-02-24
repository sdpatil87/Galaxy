import mongoose from "mongoose";

import { config } from "../config/index.js";

async function connectDB() {
  const uri = config.mongoUri;
  if (!uri) {
    throw new Error("MONGO_URI not defined in environment");
  }
  return mongoose.connect(uri);
}

export default connectDB;
