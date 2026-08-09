import { sendEmail } from "./sendEmail";
import { generateResetPasswordTemplate } from "./htmlTemplets";
import { logger } from "../config/logger";

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  try {
    await sendEmail({
      to: toEmail,
      subject: "Your Password Reset Code",
      html: generateResetPasswordTemplate(otpCode),
    });
  } catch (err) {
    logger.error(
      `Failed to send OTP email to ${toEmail}: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    throw err;
  }
}
