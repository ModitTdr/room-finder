/*
  Warnings:

  - You are about to drop the column `nationalId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[citizenshipID]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "nationalId",
ADD COLUMN     "citizenshipID" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "maxBudget" INTEGER,
ADD COLUMN     "minBudget" INTEGER,
ADD COLUMN     "preferredArea" TEXT,
ADD COLUMN     "preferredCity" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_citizenshipID_key" ON "Profile"("citizenshipID");

-- CreateIndex
CREATE INDEX "Profile_preferredCity_preferredArea_idx" ON "Profile"("preferredCity", "preferredArea");
