import User from "../models/User.js";
import Role from "../models/Role.js";
import Organization from "../models/Organization.js";
import { hashPassword, comparePasswords } from "../utils/auth.js";
import { generateToken } from "../utils/jwt.js";
import { Messages } from "../utils/messages.js";
import { logEvent } from "../utils/logger.js";
import { sendMail } from "../utils/email.js";

export const register = async (req, res) => {
  try {
    const { email, password, organization } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: Messages.ERRORS.EXISTS });
    }
    const user = new User({ email, password: hashPassword(password) });
    if (organization) {
      user.currentOrg = organization;
      user.memberships = [{ organization, roles: [] }];
    }
    await user.save();

    logEvent("user_registered", "new user registered", { user: user._id });

    res.status(201).json({ message: Messages.SUCCESS.CREATED, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });

    if (!comparePasswords(password, user.password)) {
      logEvent("auth_failure", "password mismatch", { email });
      return res.status(400).json({ message: Messages.ERRORS.INVALID("credentials") });
    }

    const token = generateToken({ id: user._id });
    logEvent("user_logged_in", "login success", { user: user._id });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    // token verification logic omitted for brevity
    if (!token) return res.status(400).json({ message: Messages.ERRORS.REQUIRED("token") });
    // verify and issue new token
    const newToken = generateToken({ id: req.user.id });
    res.json({ token: newToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    // send reset link
    const resetLink = `https://example.com/reset?user=${user._id}`;
    try {
      await sendMail({
        to: user.email,
        subject: "Password Reset",
        text: `Click here to reset your password: ${resetLink}`,
      });
    } catch (e) {
      logEvent("email_error", "password reset email failed", { error: e, user: user._id });
    }
    res.json({ message: Messages.SUCCESS.EMAIL_SENT });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

