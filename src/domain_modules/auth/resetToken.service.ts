import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as resetTokenRepo from "./resetToken.repository";
import { InvalidResetTokenException, ResetTokenAlreadyUsedException } from "../../shared/exceptions/auth.exception";

const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET as string;
const RESET_TOKEN_EXPIRY = "15m";

interface ResetTokenPayload {
  sub: string;
  purpose: string;
  jti: string;
}

export async function generateResetToken(userId: string) {
  const jti = crypto.randomUUID();
  const tokenHash = crypto.createHash("sha256").update(jti).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await resetTokenRepo.createPasswordResetToken(userId, tokenHash, expiresAt);

  return jwt.sign({ sub: userId, purpose: "PASSWORD_RESET", jti }, RESET_TOKEN_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRY,
  });
}

export async function verifyResetToken(token: string): Promise<string> {
  let decoded: ResetTokenPayload;

  try {
    decoded = jwt.verify(token, RESET_TOKEN_SECRET) as ResetTokenPayload;
  } catch {
    throw new InvalidResetTokenException();
  }

  if (decoded.purpose !== "PASSWORD_RESET") {
    throw new InvalidResetTokenException();
  }

  const tokenHash = crypto.createHash("sha256").update(decoded.jti).digest("hex");
  const tokenRecord = await resetTokenRepo.getPasswordResetToken(tokenHash);

  if (!tokenRecord) {
    throw new InvalidResetTokenException();
  }

  if (tokenRecord.usedAt) {
    throw new ResetTokenAlreadyUsedException();
  }

  if (tokenRecord.expiresAt < new Date()) {
    throw new InvalidResetTokenException();
  }

  await resetTokenRepo.updatePasswordResetToken(tokenRecord);
  return decoded.sub;
}
