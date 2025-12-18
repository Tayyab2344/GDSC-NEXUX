/*
  Warnings:

  - A unique constraint covering the columns `[regNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[membershipId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "membershipId" TEXT,
ADD COLUMN     "regNo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_regNo_key" ON "User"("regNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_membershipId_key" ON "User"("membershipId");
