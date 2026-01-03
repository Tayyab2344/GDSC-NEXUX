-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('MEMBERSHIP', 'RECRUITMENT', 'EVENT_REGISTRATION', 'FEEDBACK', 'GENERAL');

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "coverImage" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "location" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Workshop';

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "type" "FormType" NOT NULL DEFAULT 'GENERAL';
