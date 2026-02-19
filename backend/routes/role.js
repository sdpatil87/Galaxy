import express from "express";
import {
  createRole,
  listRoles,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";
import authMiddleware from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { Permissions } from "../utils/permissions.js";
import { validate } from "../middleware/validate.js";
import { createRoleSchema, updateRoleSchema } from "../validators/role.js";
const router = express.Router();

// all operations are org-specific; orgId passed as query or body
router.get("/", authMiddleware, listRoles);
router.post(
  "/",
  authMiddleware,
  authorize(Permissions.ROLE_CREATE),
  validate(createRoleSchema),
  createRole,
);
router.put(
  "/:id",
  authMiddleware,
  authorize(Permissions.ROLE_UPDATE),
  validate(updateRoleSchema),
  updateRole,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(Permissions.ROLE_DELETE),
  deleteRole,
);

export default router;
