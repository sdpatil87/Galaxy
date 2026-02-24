import Role from "../models/Role.js";
import { Permissions } from "../utils/permissions.js";

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

// create default admin role with all permissions
export const createAdminRole = async (orgId) => {
  const adminRole = new Role({
    name: "admin",
    organization: orgId,
    permissions: Object.values(Permissions),
  });
  return adminRole.save();
};

// create default member role with limited permissions
export const createMemberRole = async (orgId) => {
  const memberRole = new Role({
    name: "member",
    organization: orgId,
    permissions: [
      Permissions.ATTENDANCE_CREATE,
      Permissions.ATTENDANCE_VIEW,
      Permissions.PROJECT_VIEW,
      Permissions.TASK_CREATE,
      Permissions.TASK_UPDATE,
      Permissions.TASK_VIEW,
      Permissions.LOG_VIEW,
      Permissions.SETTINGS_VIEW,
    ],
  });
  return memberRole.save();
};
