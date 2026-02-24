import express from "express";
import {
  getUser,
  updateUser,
  listUsersInOrganization,
  addRoleToUser,
  removeRoleFromUser,
  getUserSettings,
  updateUserSettings,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { Permissions } from "../utils/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  updateUserSchema,
  userSettingsSchema,
  roleAssignmentSchema,
} from "../validators/user.js";
const router = express.Router();

// list users in an organization should come before the dynamic ID route
router.get("/organization/:orgId", authMiddleware, listUsersInOrganization);

// user settings
router.get("/:id/settings", authMiddleware, getUserSettings);
router.put(
  "/:id/settings",
  authMiddleware,
  validate(userSettingsSchema),
  updateUserSettings,
);

router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, validate(updateUserSchema), updateUser);
router.post(
  "/roles",
  authMiddleware,
  authorize(Permissions.USER_ASSIGN_ROLE),
  validate(roleAssignmentSchema),
  addRoleToUser,
);
router.delete(
  "/roles",
  authMiddleware,
  authorize(Permissions.USER_REMOVE_ROLE),
  validate(roleAssignmentSchema),
  removeRoleFromUser,
);
export default router;
