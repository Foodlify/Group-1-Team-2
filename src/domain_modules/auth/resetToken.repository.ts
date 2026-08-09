import { PasswordResetToken } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
  return prisma.passwordResetToken.create({
    data: { userId, tokenHash, purpose: "PASSWORD_RESET", expiresAt },
  });
}

export async function getPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findUnique({ where: { tokenHash } });
}

export async function updatePasswordResetToken(tokenRecord: PasswordResetToken) {
  return prisma.passwordResetToken.update({
    where: { id: tokenRecord.id },
    data: { usedAt: new Date() },
  });
}
