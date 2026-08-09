import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import * as authService from "./auth.service";
import { InvalidRefreshTokenException } from "../../shared/exceptions/auth.exception";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  sendSucess(res, { message: "Registered successfully", statusCode: StatusCodes.CREATED, data: { user } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const deviceInfo = req.headers["user-agent"];
  const ipAddress = req.ip;

  const { accessToken, refreshToken } = await authService.login(email, password, deviceInfo, ipAddress);

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  sendSucess(res, { statusCode: StatusCodes.OK, data: { accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new InvalidRefreshTokenException();

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);

  res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

  sendSucess(res, { statusCode: StatusCodes.OK, data: { accessToken } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.handleForgotPassword(email);
  sendSucess(res, { message: "If this email is registered, an OTP has been sent to it." });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const resetToken = await authService.handleVerifyOtp(email, otp);
  sendSucess(res, { data: { resetToken } });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  await authService.handleResetPassword(resetToken, newPassword);
  sendSucess(res, { message: "Password reset successfully." });
});
