import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "app.log");

// ensure directory exists
fs.mkdirSync(logDir, { recursive: true });

function writeEntry(entry) {
  try {
    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error("Failed to write log", err);
  }
}

function log(type, msg, meta) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, type, message: msg, meta };
  writeEntry(entry);
  // also output to console for development
  console.log(`[${timestamp}] [${type}] ${msg}`, meta || "");
}

export const logInfo = (msg, meta) => log("INFO", msg, meta);
export const logError = (msg, meta) => log("ERROR", msg, meta);
export const logEvent = (event, msg, meta) =>
  log(event.toUpperCase(), msg, meta);
