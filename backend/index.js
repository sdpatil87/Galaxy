import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import User from "./models/User.js";
import Organization from "./models/Organization.js";

dotenv.config();

import { config } from "./config/index.js";

const app = express();
const PORT = config.port;

// middleware
app.use(cors());
app.use(bodyParser.json());

// connect to MongoDB
import connectDB from "./db/connection.js";

(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo connection error", err);
    process.exit(1);
  }
})();

// auth middleware (already implemented in separate file)
import authMiddleware from "./middleware/auth.js";

// mount routers
import authRoutes from "./routes/auth.js";
import organizationRoutes from "./routes/organization.js";
import userRoutes from "./routes/user.js";
import roleRoutes from "./routes/role.js";
import attendanceRoutes from "./routes/attendance.js";
import taskRoutes from "./routes/task.js";

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);

// example protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: Messages.SUCCESS.PROTECTED, user: req.user });
});

// global error handler
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
