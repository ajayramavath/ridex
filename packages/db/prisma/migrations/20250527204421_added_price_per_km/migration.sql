/*
  Warnings:

  - Added the required column `pricePerKm` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "pricePerKm" DECIMAL(65,30) NOT NULL;
