import Role from "../models/Role.js";

export const createRole = (data) => {
  const role = new Role(data);
  return role.save();
};

export const listRoles = (filter) => {
  return Role.find(filter);
};

export const updateRole = (id, updates) => {
  return Role.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteRole = (id) => {
  return Role.findByIdAndDelete(id);
};
