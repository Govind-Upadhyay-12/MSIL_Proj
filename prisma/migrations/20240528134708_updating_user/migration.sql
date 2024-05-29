/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `DEALER CITY` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DEALER CODE` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DEALER NAME` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DEALER STATE` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DESIGNATION` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DESIGNATION_DESCRIPTION` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE FIRSTNAME` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE LASTNAME` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE_DOJ` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE_DOL` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE_MOBILE_NO` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE_TYPE` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GENDER` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MSPIN_NO` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PARENT GROUP NAME` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `REGION` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "DEALER CITY" TEXT NOT NULL,
ADD COLUMN     "DEALER CODE" TEXT NOT NULL,
ADD COLUMN     "DEALER NAME" TEXT NOT NULL,
ADD COLUMN     "DEALER STATE" TEXT NOT NULL,
ADD COLUMN     "DESIGNATION" TEXT NOT NULL,
ADD COLUMN     "DESIGNATION_DESCRIPTION" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE FIRSTNAME" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE LASTNAME" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE_DOJ" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE_DOL" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE_MOBILE_NO" INTEGER NOT NULL,
ADD COLUMN     "EMPLOYEE_TYPE" TEXT NOT NULL,
ADD COLUMN     "GENDER" TEXT NOT NULL,
ADD COLUMN     "MSPIN_NO" INTEGER NOT NULL,
ADD COLUMN     "PARENT GROUP NAME" TEXT NOT NULL,
ADD COLUMN     "REGION" TEXT NOT NULL;
