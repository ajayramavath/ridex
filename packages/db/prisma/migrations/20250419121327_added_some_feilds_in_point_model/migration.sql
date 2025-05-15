/*
  Warnings:

  - You are about to drop the column `city` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Point` table. All the data in the column will be lost.
  - Added the required column `short_address` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Made the column `full_address` on table `Point` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Point" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "premise" TEXT,
ADD COLUMN     "short_address" TEXT NOT NULL,
ALTER COLUMN "full_address" SET NOT NULL;
