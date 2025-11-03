/*
  Warnings:

  - You are about to drop the column `khaltiTransactionId` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "khaltiTransactionId",
ADD COLUMN     "esewaTransactionId" TEXT;
