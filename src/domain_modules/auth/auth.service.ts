import { hashPassword, comparePassword, hashToken } from "../../utils/hash";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import * as authRepo from "./auth.repository";
import * as otpServices from "./otp.service";
import * as resetTokenServices from "./resetToken.service";
import { sendOtpEmail } from "../../utils/email.util";
import { RegisterDTO } from "./auth.validation";
import { UserStatus } from "@prisma/client";
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  InvalidRefreshTokenException,
  SecurityBreachException,
  InvalidOTPRequestException,
} from "../../shared/exceptions/auth.exception";

const generateTokens = async (
  userId: string,
  role: string,
  deviceInfo?: string | null,
  ipAddress?: string | null
) => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await authRepo.createRefreshToken({ tokenHash, userId, expiresAt, deviceInfo, ipAddress });

  return { accessToken, refreshToken };
};

export const register = async (data: RegisterDTO) => {
  const existingUser = await authRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new EmailAlreadyExistsException();
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await authRepo.createUser({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
  });

  return { id: user.id, email: user.email, role: user.role };
};

export const login = async (
  email: string,
  password: string,
  deviceInfo?: string,
  ipAddress?: string
) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) throw new InvalidCredentialsException();

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new InvalidCredentialsException();

  if (user.status === UserStatus.SUSPENDED) throw new InvalidCredentialsException();

  return generateTokens(user.id, user.role, deviceInfo, ipAddress);
};

export const refreshAccessToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  const storedToken = await authRepo.findRefreshToken(tokenHash);

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new InvalidRefreshTokenException();
  }

  if (storedToken.revoked) {
    await authRepo.revokeAllRefreshTokens(storedToken.userId);
    throw new SecurityBreachException();
  }

  const result = await authRepo.revokeRefreshTokenIfActive(tokenHash);

  if (result.count === 0) {
    await authRepo.revokeAllRefreshTokens(storedToken.userId);
    throw new SecurityBreachException();
  }

  const user = await authRepo.findUserById(storedToken.userId);
  if (!user) throw new InvalidRefreshTokenException();

  return generateTokens(user.id, user.role, storedToken.deviceInfo, storedToken.ipAddress);
};

export const handleForgotPassword = async (email: string) => {
  const user = await authRepo.findUserByEmail(email);
  if (user) {
    const otpCode = await otpServices.createOtp(user.id, "EMAIL", "PASSWORD_RESET");
    await sendOtpEmail(user.email, otpCode);
  }

  // always return true so we don't leak whether the email is registered
  return true;
};

export const handleVerifyOtp = async (email: string, otpCode: string) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new InvalidOTPRequestException();
  }

  await otpServices.verifyOtp(user.id, otpCode, "PASSWORD_RESET");

  return resetTokenServices.generateResetToken(user.id);
};

export const handleResetPassword = async (resetToken: string, newPassword: string) => {
  const userId = await resetTokenServices.verifyResetToken(resetToken);

  const hashedPassword = await hashPassword(newPassword);
  await authRepo.updatePassword(userId, hashedPassword);
  await authRepo.revokeAllRefreshTokens(userId);
};