import Task from "../models/Task.js";

export const createTask = (data) => {
  const t = new Task(data);
  return t.save();
};

export const updateTask = (id, updates) => {
  return Task.findByIdAndUpdate(id, updates, { new: true });
};

export const listTasks = (filter, options = {}) => {
  let query = Task.find(filter);
  if (options.populate) {
    // options.populate can be string or array of paths or objects
    const pops = Array.isArray(options.populate)
      ? options.populate
      : [options.populate];
    pops.forEach((p) => {
      query = query.populate(p);
    });
  }
  return query;
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
