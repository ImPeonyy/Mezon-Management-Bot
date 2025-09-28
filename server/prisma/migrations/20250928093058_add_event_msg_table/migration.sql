/*
  Warnings:

  - You are about to drop the column `clanName` on the `Clan` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Clan` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Clan` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Clan` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `clan_name` to the `Clan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Clan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Clan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `welcome_channel_id` to the `Clan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EEvent" AS ENUM ('CLAN_JOIN', 'CLAN_LEAVE');

-- DropForeignKey
ALTER TABLE "public"."Clan" DROP CONSTRAINT "Clan_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Clan" DROP COLUMN "clanName",
DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "clan_name" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "welcome_channel_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."EventMessage" (
    "id" SERIAL NOT NULL,
    "clan_id" TEXT NOT NULL,
    "event" "public"."EEvent" NOT NULL,
    "template" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Clan" ADD CONSTRAINT "Clan_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventMessage" ADD CONSTRAINT "EventMessage_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "public"."Clan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
