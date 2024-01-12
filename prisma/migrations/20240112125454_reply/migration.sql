/*
  Warnings:

  - You are about to drop the `_replies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_replies" DROP CONSTRAINT "_replies_A_fkey";

-- DropForeignKey
ALTER TABLE "_replies" DROP CONSTRAINT "_replies_B_fkey";

-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "replyId" TEXT;

-- DropTable
DROP TABLE "_replies";

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
