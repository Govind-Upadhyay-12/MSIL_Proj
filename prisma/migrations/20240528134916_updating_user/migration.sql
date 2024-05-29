/*
  Warnings:

  - You are about to drop the column `DESIGNATION_DESCRIPTION` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `EMPLOYEE_DOJ` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `EMPLOYEE_DOL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `EMPLOYEE_MOBILE_NO` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `EMPLOYEE_TYPE` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `MSPIN_NO` on the `User` table. All the data in the column will be lost.
  - Added the required column `DESIGNATION DESCRIPTION` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE DOJ` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE DOL` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE MOBILE NO` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPLOYEE TYPE` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MSPIN NO` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "DESIGNATION_DESCRIPTION",
DROP COLUMN "EMPLOYEE_DOJ",
DROP COLUMN "EMPLOYEE_DOL",
DROP COLUMN "EMPLOYEE_MOBILE_NO",
DROP COLUMN "EMPLOYEE_TYPE",
DROP COLUMN "MSPIN_NO",
ADD COLUMN     "DESIGNATION DESCRIPTION" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE DOJ" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE DOL" TEXT NOT NULL,
ADD COLUMN     "EMPLOYEE MOBILE NO" INTEGER NOT NULL,
ADD COLUMN     "EMPLOYEE TYPE" TEXT NOT NULL,
ADD COLUMN     "MSPIN NO" INTEGER NOT NULL;
