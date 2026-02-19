import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
} from "../controllers/organizationController.js";
import authMiddleware from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { Permissions } from "../utils/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "../validators/organization.js";

const router = express.Router();

// everyone with token can list their organizations, super admins see all
router.post(
  "/",
  authMiddleware,
  validate(createOrganizationSchema),
  createOrganization,
);
router.get("/", authMiddleware, getOrganizations);
router.get("/:id", authMiddleware, getOrganizationById);
router.put(
  "/:id",
  authMiddleware,
  authorize(Permissions.ORG_UPDATE),
  validate(updateOrganizationSchema),
  updateOrganization,
);

export default router;
