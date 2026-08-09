import { OtpChannel, OtpPurpose, OtpStatus } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function createOtpRecord(
  userId: string,
  channel: OtpChannel,
  purpose: OtpPurpose,
  otpHash: string,
  expiresAt: Date
) {
  return prisma.otpRequest.create({ data: { userId, channel, purpose, otpHash, expiresAt } });
}

export async function findLatestPendingOtp(userId: string, purpose: OtpPurpose) {
  return prisma.otpRequest.findFirst({
    where: { userId, purpose, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOtpStatus(otpId: string, status: OtpStatus) {
  return prisma.otpRequest.update({ where: { id: otpId }, data: { status } });
}

export async function incrementOtpAttempts(otpId: string) {
  return prisma.otpRequest.update({ where: { id: otpId }, data: { attemptCount: { increment: 1 } } });
}
