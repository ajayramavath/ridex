/*
  Warnings:

  - Added the required column `distance_m` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_s` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "distance_m" INTEGER NOT NULL,
ADD COLUMN     "duration_s" TEXT NOT NULL;
