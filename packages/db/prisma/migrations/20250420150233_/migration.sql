/*
  Warnings:

  - You are about to drop the column `room_id` on the `Ride` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_room_id_fkey";

-- DropIndex
DROP INDEX "Ride_room_id_key";

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "room_id";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "rideId" TEXT;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE SET NULL ON UPDATE CASCADE;
