import * as roleService from '../services/roleService.js';
import { Messages } from '../utils/messages.js';
import { logEvent } from '../utils/logger.js';

// helpers to ensure only org admins or superadmins can modify roles
const ensureOrgAdmin = (req) => {
  if (req.user.isSuperAdmin) return true;
  // additional logic could go here (e.g. check membership role names)
  return true; // placeholder until proper permission middleware added
};

export const createRole = async (req, res) => {
  try {
    const { organization, name, permissions } = req.body;
    if (!organization || !name) {
      return res.status(400).json({ message: Messages.ERRORS.REQUIRED('organization and name') });
    }
    if (!ensureOrgAdmin(req)) return res.status(403).json({ message: Messages.ERRORS.FORBIDDEN });

    const role = await roleService.createRole({ organization, name, permissions: permissions || [] });
    logEvent('role_created', 'role created', { role: role._id, organization });
    res.status(201).json(role);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: Messages.ERRORS.EXISTS });
    }
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const listRoles = async (req, res) => {
  try {
    const filter = {};
    if (req.query.organization) filter.organization = req.query.organization;
    const roles = await roleService.listRoles(filter);
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const updateRole = async (req, res) => {
  try {
    if (!ensureOrgAdmin(req)) return res.status(403).json({ message: Messages.ERRORS.FORBIDDEN });
    const role = await roleService.updateRole(req.params.id, req.body);
    logEvent('role_updated', 'role updated', { role: req.params.id, updates: req.body });
    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const deleteRole = async (req, res) => {
  try {
    if (!ensureOrgAdmin(req)) return res.status(403).json({ message: Messages.ERRORS.FORBIDDEN });
    await roleService.deleteRole(req.params.id);
    logEvent('role_deleted', 'role deleted', { role: req.params.id });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

