/*
  Warnings:

  - You are about to drop the column `lat` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `Point` table. All the data in the column will be lost.
  - Added the required column `location` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- AlterTable
ALTER TABLE "Point" DROP COLUMN "lat",
DROP COLUMN "long",
ADD COLUMN     "location" geography(Point, 4326) NOT NULL;

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "route" geography(LineString,4326) NOT NULL;
