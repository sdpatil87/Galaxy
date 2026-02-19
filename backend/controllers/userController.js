import User from "../models/User.js";
import { Messages } from "../utils/messages.js";
import { logEvent } from "../utils/logger.js";
import { sendMail } from "../utils/email.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // handle separately if needed
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    logEvent("user_updated", "user profile updated", { user: req.params.id, updates });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const listUsersInOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const users = await User.find({ "memberships.organization": orgId }).select(
      "-password",
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const addRoleToUser = async (req, res) => {
  try {
    const { userId, orgId, roleId } = req.body;
    if (!userId || !orgId || !roleId) {
      return res
        .status(400)
        .json({ message: Messages.ERRORS.REQUIRED("userId, orgId and roleId") });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    const membership = user.memberships.find(
      (m) => m.organization.toString() === orgId,
    );
    if (!membership) {
      user.memberships.push({ organization: orgId, roles: [roleId] });
    } else {
      if (!membership.roles.map((r) => r.toString()).includes(roleId))
        membership.roles.push(roleId);
    }
    await user.save();

    logEvent("role_assigned", "role assigned to user", { user: userId, orgId, roleId });

    // send notification email
    try {
      await sendMail({
        to: user.email,
        subject: "You have been assigned a new role",
        text: `Your role in organization ${orgId} has been updated.`,
      });
    } catch (e) {
      logEvent("email_error", "role assignment notification failed", { error: e, user: userId });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const removeRoleFromUser = async (req, res) => {
  try {
    const { userId, orgId, roleId } = req.body;
    if (!userId || !orgId || !roleId) {
      return res
        .status(400)
        .json({ message: Messages.ERRORS.REQUIRED("userId, orgId and roleId") });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    const membership = user.memberships.find(
      (m) => m.organization.toString() === orgId,
    );
    if (membership) {
      membership.roles = membership.roles.filter(
        (r) => r.toString() !== roleId,
      );
      await user.save();
    }

    logEvent("role_removed", "role removed from user", { user: userId, orgId, roleId });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

