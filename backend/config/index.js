import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost/galaxy",
  jwtSecret: process.env.JWT_SECRET || "please-set-jwt-secret",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  // any additional configuration values can go here
};
