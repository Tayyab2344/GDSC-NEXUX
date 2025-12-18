-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_postedBy_fkey" FOREIGN KEY ("postedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
