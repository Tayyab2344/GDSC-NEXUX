-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('VIDEO', 'ARTICLE', 'DOCUMENTATION', 'COURSE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL DEFAULT 'ARTICLE',
    "fieldId" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "repoLink" TEXT,
    "demoLink" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "fieldId" TEXT NOT NULL,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectMembers_B_index" ON "_ProjectMembers"("B");

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
