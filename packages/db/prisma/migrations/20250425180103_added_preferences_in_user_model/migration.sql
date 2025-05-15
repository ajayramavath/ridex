-- CreateEnum
CREATE TYPE "PreferenceOption" AS ENUM ('GOOD', 'NEUTRAL', 'AGAINST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatPreference" "PreferenceOption" DEFAULT 'NEUTRAL',
ADD COLUMN     "musicPreference" "PreferenceOption" DEFAULT 'NEUTRAL',
ADD COLUMN     "petPreference" "PreferenceOption" DEFAULT 'NEUTRAL',
ADD COLUMN     "smokingPreference" "PreferenceOption" DEFAULT 'AGAINST';
