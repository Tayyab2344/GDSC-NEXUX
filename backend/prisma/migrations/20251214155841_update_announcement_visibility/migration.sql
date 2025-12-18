/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Announcement` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FieldCategory" AS ENUM ('TECHNICAL', 'NON_TECHNICAL');

-- CreateEnum
CREATE TYPE "ChatVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'LEADS_ONLY', 'HIDDEN');

-- CreateEnum
CREATE TYPE "AnnouncementVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'LEADS_ONLY');

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'VERIFIED';

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "isPublic",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "visibility" "AnnouncementVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "visibility" "ChatVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "category" "FieldCategory" NOT NULL DEFAULT 'TECHNICAL';

-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN     "eventName" TEXT,
ADD COLUMN     "location" TEXT;

-- AddForeignKey
ALTER TABLE "GalleryItem" ADD CONSTRAINT "GalleryItem_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
