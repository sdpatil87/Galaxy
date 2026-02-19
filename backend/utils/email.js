import nodemailer from "nodemailer";
import { config } from "../config/index.js";
import { logInfo, logError } from "./logger.js";

let transporter;

if (config.smtp.host) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port || 587,
    secure: !!config.smtp.secure,
    auth: config.smtp.user
      ? { user: config.smtp.user, pass: config.smtp.pass }
      : undefined,
  });
} else {
  // stub transporter that logs to console
  transporter = {
    sendMail: async (mail) => {
      logInfo("stub sendMail", mail);
      return { messageId: "stub" };
    },
  };
}

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.user || "no-reply@localhost",
      to,
      subject,
      text,
      html,
    });
    logInfo("email sent", { to, subject, messageId: info.messageId });
    return info;
  } catch (err) {
    logError("email send failed", { error: err, to, subject });
    throw err;
  }
};
