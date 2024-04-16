/*
  Warnings:

  - You are about to drop the column `user_id` on the `Adds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Adds" DROP CONSTRAINT "Adds_user_id_fkey";

-- AlterTable
ALTER TABLE "Adds" DROP COLUMN "user_id";
