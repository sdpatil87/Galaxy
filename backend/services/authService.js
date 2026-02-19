import User from "../models/User.js";

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const createUser = (userData) => {
  const user = new User(userData);
  return user.save();
};
