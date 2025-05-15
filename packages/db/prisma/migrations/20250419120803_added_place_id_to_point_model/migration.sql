/*
  Warnings:

  - A unique constraint covering the columns `[place_id]` on the table `Point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `place_id` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "place_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Point_place_id_key" ON "Point"("place_id");
