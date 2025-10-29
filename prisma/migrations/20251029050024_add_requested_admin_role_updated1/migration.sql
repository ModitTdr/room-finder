/*
  Warnings:

  - You are about to drop the column `requestedAdminRole` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RoleRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "requestedAdminRole",
ADD COLUMN     "requestedOwnerRole" "public"."RoleRequestStatus";

-- DropEnum
DROP TYPE "public"."AdminRequestStatus";
