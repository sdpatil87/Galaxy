import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { Messages } from "../utils/messages.js";
import { logEvent } from "../utils/logger.js";

// create organization and add membership
export const createOrganization = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ message: Messages.ERRORS.REQUIRED("Organization name") });

    // if superadmin, allow any org
    const org = new Organization({ name, address, createdBy: req.user.id });
    await org.save();

    // create default admin role with wildcard permissions
    const Role = (await import("../models/Role.js")).default;
    const adminRole = new Role({
      name: "admin",
      organization: org._id,
      permissions: ["*"],
    });
    await adminRole.save();

    // add membership for the creator with the new role
    const user = await User.findById(req.user.id);
    if (user) {
      user.memberships.push({ organization: org._id, roles: [adminRole._id] });
      await user.save();
    }

    logEvent("org_created", "organization created", {
      org: org._id,
      createdBy: req.user.id,
    });

    res
      .status(201)
      .json({ message: Messages.SUCCESS.ORG_CREATED, organization: org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    if (req.user.isSuperAdmin) {
      const orgs = await Organization.find();
      return res.json(orgs);
    }
    // otherwise, find orgs where user has membership
    const user = await User.findById(req.user.id).populate(
      "memberships.organization",
    );
    const orgs = user?.memberships?.map((m) => m.organization) || [];
    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org)
      return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const updates = req.body;
    const org = await Organization.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!org)
      return res.status(404).json({ message: Messages.ERRORS.NOT_FOUND });
    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};
