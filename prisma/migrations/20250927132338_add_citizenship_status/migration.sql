-- CreateEnum
CREATE TYPE "public"."CitizenshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "citizenshipStatus" "public"."CitizenshipStatus";
