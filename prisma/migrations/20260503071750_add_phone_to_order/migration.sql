/*
  Warnings:

  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "postalCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "phone" TEXT NOT NULL;
