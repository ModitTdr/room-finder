-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "requestedAdminRole" DROP NOT NULL,
ALTER COLUMN "requestedAdminRole" DROP DEFAULT;
