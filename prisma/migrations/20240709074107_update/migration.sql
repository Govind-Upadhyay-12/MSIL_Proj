/*
  Warnings:

  - You are about to drop the column `DESIGNATION` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `GENDER` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `REGION` on the `User` table. All the data in the column will be lost.
  - Added the required column `designation` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "DESIGNATION",
DROP COLUMN "GENDER",
DROP COLUMN "REGION",
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL;
