import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePasswords = (candidatePassword, hashedPassword) => {
  return bcrypt.compareSync(candidatePassword, hashedPassword);
};
