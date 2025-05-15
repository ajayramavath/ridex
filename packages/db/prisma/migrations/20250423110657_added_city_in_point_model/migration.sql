/*
  Warnings:

  - Added the required column `city` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "city" TEXT NOT NULL;
