import * as projectService from "../services/projectService.js";
import * as taskService from "../services/taskService.js";
import { Messages } from "../utils/messages.js";
import { logEvent } from "../utils/logger.js";

export const createProject = async (req, res) => {
  try {
    const data = {
      ...req.body,
      organization: req.body.organization || req.user.currentOrg,
      createdBy: req.user.id,
    };
    const project = await projectService.createProject(data);
    logEvent("project_created", "project created", { project: project._id, organization: data.organization });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const listProjects = async (req, res) => {
  try {
    const orgId = req.query.organization || req.user.currentOrg;
    const filter = { organization: orgId };
    const projects = await projectService.listProjects(filter);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const addTask = async (req, res) => {
  try {
    const data = {
      ...req.body,
      project: req.params.projectId,
      assignedTo: req.body.assignedTo,
    };
    const task = await taskService.createTask(data);
    logEvent("task_created", "task created", { task: task._id, project: data.project });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.taskId, req.body);
    logEvent("task_updated", "task updated", { task: req.params.taskId, updates: req.body });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const addTaskLog = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { start, end, note } = req.body;
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: Messages.ERRORS.REQUIRED("start and end timestamps") });
    }
    const duration = (new Date(end) - new Date(start)) / 3600000; // hours
    const log = {
      user: req.user.id,
      start: new Date(start),
      end: new Date(end),
      duration,
      note,
    };
    const task = await taskService.addLog(taskId, log);
    // optionally update hoursLogged total
    const total = task.logs.reduce((acc, l) => acc + (l.duration || 0), 0);
    task.hoursLogged = total;
    await task.save();

    logEvent("task_log_added", "task log added", { task: taskId, project: projectId, user: req.user.id, duration });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const listTaskLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await taskService.listLogs(taskId);
    if (!task) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    res.json(task.logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectService.getProjectById(projectId);
    if (!project) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    const tasks = await taskService.listTasks({ project: projectId });
    res.json({ project, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

