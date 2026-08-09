import prisma from "../../lib/prisma";
import { User, Prisma } from "@prisma/client";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};


export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      customer: { create: {} },
    },
  });
};

export const createRefreshToken = async (data: Prisma.RefreshTokenUncheckedCreateInput) => {
  return prisma.refreshToken.create({ data });
};

export const findRefreshToken = async (tokenHash: string) => {
  return prisma.refreshToken.findUnique({ where: { tokenHash } });
};

export const revokeRefreshTokenIfActive = async (tokenHash: string) => {
  return prisma.refreshToken.updateMany({
    where: { tokenHash, revoked: false },
    data: { revoked: true },
  });
};

export const revokeAllRefreshTokens = async (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};

export const updatePassword = async (userId: string, newPassword: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newPassword, passwordChangedAt: new Date() },
  });
};