import Project from "../models/Project.js";

export const createProject = (data) => {
  const p = new Project(data);
  return p.save();
};

export const listProjects = (filter) => {
  return Project.find(filter);
};

export const getProjectById = (id) => {
  return Project.findById(id);
};
