import Task from "../models/Task.js";

export const createTask = (data) => {
  const t = new Task(data);
  return t.save();
};

export const updateTask = (id, updates) => {
  return Task.findByIdAndUpdate(id, updates, { new: true });
};

export const listTasks = (filter) => {
  return Task.find(filter);
};

export const addLog = (taskId, log) => {
  return Task.findByIdAndUpdate(
    taskId,
    { $push: { logs: log } },
    { new: true },
  );
};

export const listLogs = (taskId) => {
  return Task.findById(taskId).select("logs");
};
