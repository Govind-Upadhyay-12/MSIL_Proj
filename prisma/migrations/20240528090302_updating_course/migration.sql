/*
  Warnings:

  - You are about to drop the column `title` on the `Course` table. All the data in the column will be lost.
  - Added the required column `Duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `module_name` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "title",
ADD COLUMN     "Duration" TEXT NOT NULL,
ADD COLUMN     "module_name" TEXT NOT NULL;
