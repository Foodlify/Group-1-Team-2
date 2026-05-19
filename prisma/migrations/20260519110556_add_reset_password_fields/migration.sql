-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordOtp" TEXT,
ADD COLUMN     "resetPasswordOtpExpiry" TIMESTAMP(3);
