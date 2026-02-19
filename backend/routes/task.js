import express from "express";
import {
  createProject,
  addTask,
  listProjects,
  updateTask,
  addTaskLog,
  listTaskLogs,
  getProjectDetails,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { Permissions } from "../utils/permissions.js";
import { validate } from "../middleware/validate.js";
import {
  createProjectSchema,
  addTaskSchema,
  updateTaskSchema,
  addLogSchema,
} from "../validators/task.js";
const router = express.Router();

router.post(
  "/projects",
  authMiddleware,
  authorize(Permissions.PROJECT_CREATE),
  validate(createProjectSchema),
  createProject,
);
router.get(
  "/projects",
  authMiddleware,
  authorize(Permissions.PROJECT_VIEW),
  listProjects,
);

router.post(
  "/projects/:projectId/tasks",
  authMiddleware,
  authorize(Permissions.TASK_CREATE),
  validate(addTaskSchema),
  addTask,
);
router.put(
  "/tasks/:taskId",
  authMiddleware,
  authorize(Permissions.TASK_UPDATE),
  validate(updateTaskSchema),
  updateTask,
);

// task logs
router.post(
  "/projects/:projectId/tasks/:taskId/logs",
  authMiddleware,
  authorize(Permissions.TASK_UPDATE),
  validate(addLogSchema),
  addTaskLog,
);
router.get(
  "/tasks/:taskId/logs",
  authMiddleware,
  authorize(Permissions.TASK_VIEW),
  listTaskLogs,
);

// project details
router.get(
  "/projects/:projectId",
  authMiddleware,
  authorize(Permissions.PROJECT_VIEW),
  getProjectDetails,
);

export default router;
