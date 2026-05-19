import { User } from "@prisma/client";

export const sanitizeUser = (user: User) => {
  const { password, ...safeUser } = user;
  return safeUser;
};