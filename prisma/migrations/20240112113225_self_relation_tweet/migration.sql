/*
  Warnings:

  - You are about to drop the column `quotedId` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_quotedId_fkey";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "quotedId",
ADD COLUMN     "tweetId" TEXT;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
