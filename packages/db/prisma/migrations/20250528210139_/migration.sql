/*
  Warnings:

  - Changed the type of `duration_s` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "duration_s",
ADD COLUMN     "duration_s" INTEGER NOT NULL;
