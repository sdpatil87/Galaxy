import Organization from "../models/Organization.js";

export const createOrganization = (data) => {
  const org = new Organization(data);
  return org.save();
};

export const getAllOrganizations = () => Organization.find();
