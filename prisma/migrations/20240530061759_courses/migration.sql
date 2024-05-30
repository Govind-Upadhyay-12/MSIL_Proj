/*
  Warnings:

  - You are about to drop the column `Duration` on the `Course` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "Duration",
ADD COLUMN     "duration" TEXT NOT NULL;
