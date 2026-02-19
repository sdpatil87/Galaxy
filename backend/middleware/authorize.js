import User from "../models/User.js";
import { Messages } from "../utils/messages.js";

/**
 * permission: string like 'attendance:create' or 'task:update'
 * returns middleware that verifies the user has at least one role in the
 * current organization containing that permission.
 * organization id is expected in req.body.organization || req.query.organization || req.params.orgId
 */
export default function authorize(permission) {
  return async (req, res, next) => {
    try {
      if (req.user.isSuperAdmin) return next();

      const orgId =
        req.body.organization ||
        req.query.organization ||
        req.params.orgId ||
        req.params.organization;
      if (!orgId) {
        return res.status(400).json({ message: Messages.ERRORS.MISSING_ORG });
      }
      const user = await User.findById(req.user.id).populate({
        path: "memberships.roles",
        model: "Role",
      });
      if (!user)
        return res.status(401).json({ message: Messages.ERRORS.UNAUTHORIZED });

      const membership = user.memberships.find(
        (m) => m.organization.toString() === orgId.toString(),
      );
      if (!membership)
        return res.status(403).json({ message: Messages.ERRORS.MUST_BELONG });

      const has = membership.roles.some((r) => {
        if (!r.permissions) return false;
        if (r.permissions.includes("*")) return true;
        return r.permissions.includes(permission);
      });
      if (!has)
        return res.status(403).json({ message: Messages.ERRORS.INSUFFICIENT });
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: Messages.ERRORS.SERVER });
    }
  };
}
