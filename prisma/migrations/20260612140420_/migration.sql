/*
  Warnings:

  - You are about to drop the column `userId` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_userId_fkey";

-- DropIndex
DROP INDEX "Restaurant_userId_key";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "restaurantId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
