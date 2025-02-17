/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'temporary_password',
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "CryptoPrice" (
    "id" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "marketCap" DOUBLE PRECISION,
    "change24h" DOUBLE PRECISION,
    "change7d" DOUBLE PRECISION,
    "allTimeHigh" DOUBLE PRECISION,
    "allTimeLow" DOUBLE PRECISION,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoPrice_coinId_key" ON "CryptoPrice"("coinId");
