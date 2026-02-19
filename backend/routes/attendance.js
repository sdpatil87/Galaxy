import express from "express";
import {
  addAttendance,
  listAttendance,
  getDailySummary,
  getDailySummaryForUser,
  getRangeSummary,
  exportRangeCSV,
  getPeriodSummary,
} from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { Permissions } from "../utils/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  addAttendanceSchema,
  rangeSummarySchema,
  periodSummarySchema,
} from "../validators/attendance.js";

const router = express.Router();

// add attendance entry
router.post(
  "/",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_CREATE),
  validate(addAttendanceSchema),
  addAttendance,
);

// list raw attendance entries
router.get(
  "/",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_VIEW),
  listAttendance,
);

// daily summary for current org or optionally for specific organization/user
router.get(
  "/summary",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_VIEW),
  getDailySummary,
);

// daily summary for a specific user
router.get(
  "/user/:userId/summary",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_VIEW),
  getDailySummaryForUser,
);

// range summaries and export
router.get(
  "/summary/range",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_VIEW),
  validate(rangeSummarySchema, "query"),
  getRangeSummary,
);

router.get(
  "/summary/export",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_VIEW),
  validate(rangeSummarySchema, "query"),
  exportRangeCSV,
);

// period summary (week or month)
router.get(
  "/summary/period",
  authMiddleware,
  authorize(Permissions.ATTENDANCE_VIEW),
  validate(periodSummarySchema, "query"),
  getPeriodSummary,
);

export default router;
