/*
  Warnings:

  - You are about to drop the column `geohash` on the `Point` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[place_id]` on the table `Point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `geohash6` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geohash7` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geohash8` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geohash_full` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Point_geohash_idx";

-- AlterTable
ALTER TABLE "Point" DROP COLUMN "geohash",
ADD COLUMN     "geohash6" TEXT NOT NULL,
ADD COLUMN     "geohash7" TEXT NOT NULL,
ADD COLUMN     "geohash8" TEXT NOT NULL,
ADD COLUMN     "geohash_full" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Point_place_id_key" ON "Point"("place_id");

-- CreateIndex
CREATE INDEX "Point_geohash6_idx" ON "Point"("geohash6");

-- CreateIndex
CREATE INDEX "Point_geohash7_idx" ON "Point"("geohash7");

-- CreateIndex
CREATE INDEX "Point_geohash8_idx" ON "Point"("geohash8");

-- CreateIndex
CREATE INDEX "Point_place_id_idx" ON "Point"("place_id");

-- CreateIndex
CREATE INDEX "Ride_departure_point_id_idx" ON "Ride"("departure_point_id");

-- CreateIndex
CREATE INDEX "Ride_destination_point_id_idx" ON "Ride"("destination_point_id");

-- CreateIndex
CREATE INDEX "Ride_departure_time_idx" ON "Ride"("departure_time");

-- CreateIndex
CREATE INDEX "Ride_available_seats_idx" ON "Ride"("available_seats");
