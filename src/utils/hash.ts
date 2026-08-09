import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

// used to store refresh/reset tokens in the DB without keeping the raw token around
export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
