-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FACULTY_HEAD', 'PRESIDENT', 'TEAM_LEAD', 'CO_LEAD', 'TEAM_MEMBER', 'GENERAL_MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('AUTHENTICATED', 'APPLICANT', 'MEMBER', 'REJECTED', 'ALUMNI');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "googleId" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'GENERAL_MEMBER',
    "status" "UserStatus" NOT NULL DEFAULT 'AUTHENTICATED',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "Role",
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT true,
    "teamId" TEXT,
    "fieldId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "meetingUrl" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "teamId" TEXT,
    "fieldId" TEXT,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER,
    "fieldId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "meetingUrl" TEXT,
    "resources" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT,
    "meetingId" TEXT,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "lastHeartbeat" TIMESTAMP(3),
    "totalMinutesPresent" INTEGER NOT NULL DEFAULT 0,
    "attendancePercentage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "schema" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT,
    "data" JSONB NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "coverImage" TEXT,
    "registrationLink" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postedBy" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumni" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "currentRole" TEXT,
    "company" TEXT,
    "linkedinProfile" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_userId_teamId_key" ON "TeamMember"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "FieldMember_userId_fieldId_key" ON "FieldMember"("userId", "fieldId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldMember" ADD CONSTRAINT "FieldMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldMember" ADD CONSTRAINT "FieldMember_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
