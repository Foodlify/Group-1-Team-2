import bcrypt from "bcrypt";
import { OtpChannel, OtpPurpose } from "@prisma/client";
import { generateOtpCode } from "../../utils/otpGenerator";
import * as otpRepo from "./otp.repository";
import {
  OtpNotFoundException,
  OTPExpiredException,
  OtpMaxAttemptsExceededException,
  InvalidOTPException,
} from "../../shared/exceptions/auth.exception";

const OTP_EXPIRY_MINUTES = 5;

export async function createOtp(userId: string, channel: OtpChannel, purpose: OtpPurpose) {
  const otpCode = generateOtpCode();
  const otpHash = await bcrypt.hash(otpCode, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpRepo.createOtpRecord(userId, channel, purpose, otpHash, expiresAt);

  return otpCode;
}

export async function verifyOtp(userId: string, code: string, purpose: OtpPurpose) {
  const otpRecord = await otpRepo.findLatestPendingOtp(userId, purpose);

  if (!otpRecord) {
    throw new OtpNotFoundException();
  }

  if (otpRecord.expiresAt < new Date()) {
    await otpRepo.updateOtpStatus(otpRecord.id, "EXPIRED");
    throw new OTPExpiredException();
  }

  if (otpRecord.attemptCount >= otpRecord.maxAttempts) {
    await otpRepo.updateOtpStatus(otpRecord.id, "EXPIRED");
    throw new OtpMaxAttemptsExceededException();
  }

  const isValid = await bcrypt.compare(code, otpRecord.otpHash);

  if (!isValid) {
    await otpRepo.incrementOtpAttempts(otpRecord.id);
    throw new InvalidOTPException();
  }

  await otpRepo.updateOtpStatus(otpRecord.id, "USED");
  return true;
}
