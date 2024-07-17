/*
  Warnings:

  - You are about to drop the column `designation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - Added the required column `DESIGNATION` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GENDER` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "designation",
DROP COLUMN "gender",
ADD COLUMN     "DESIGNATION" TEXT NOT NULL,
ADD COLUMN     "GENDER" TEXT NOT NULL;
