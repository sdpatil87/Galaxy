import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { Messages } from "../utils/messages.js";
import { logEvent } from "../utils/logger.js";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logEvent("auth_failure", "no token provided", { ip: req.ip });
    return res.status(401).json({ message: Messages.ERRORS.UNAUTHORIZED });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    logEvent("auth_failure", "invalid token", { error: err.message });
    return res.status(401).json({ message: Messages.ERRORS.UNAUTHORIZED });
  }
}
