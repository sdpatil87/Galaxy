import express from "express";
import {
  register,
  login,
  me,
  switchOrganization,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  switchOrgSchema,
} from "../validators/auth.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);
router.post(
  "/switch-org",
  authMiddleware,
  validate(switchOrgSchema),
  switchOrganization,
);

export default router;
