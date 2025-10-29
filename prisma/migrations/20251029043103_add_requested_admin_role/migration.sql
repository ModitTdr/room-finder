-- CreateEnum
CREATE TYPE "public"."AdminRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "requestedAdminRole" "public"."AdminRequestStatus" NOT NULL DEFAULT 'PENDING';
