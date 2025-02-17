-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authKey" TEXT,
ADD COLUMN     "authKeyExpiresAt" TIMESTAMP(3);
