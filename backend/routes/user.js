import express from "express";
import {
  getUser,
  updateUser,
  listUsersInOrganization,
  addRoleToUser,
  removeRoleFromUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { Permissions } from "../utils/permissions.js";
import { validate } from "../middleware/validate.js";
import { updateUserSchema, roleAssignmentSchema } from "../validators/user.js";
const router = express.Router();

router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, validate(updateUserSchema), updateUser);
router.get("/organization/:orgId", authMiddleware, listUsersInOrganization);
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
