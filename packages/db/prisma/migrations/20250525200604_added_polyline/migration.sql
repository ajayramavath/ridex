/*
  Warnings:

  - Added the required column `polyline` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "polyline" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Point_location_idx" ON "Point" USING GIST ("location");

-- CreateIndex
CREATE INDEX "Ride_route_idx" ON "Ride" USING GIST ("route");
