/*
  Warnings:

  - You are about to drop the `_quotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_quotes" DROP CONSTRAINT "_quotes_A_fkey";

-- DropForeignKey
ALTER TABLE "_quotes" DROP CONSTRAINT "_quotes_B_fkey";

-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "quotedId" TEXT;

-- DropTable
DROP TABLE "_quotes";

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_quotedId_fkey" FOREIGN KEY ("quotedId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
