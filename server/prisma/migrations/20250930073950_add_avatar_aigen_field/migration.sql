-- AlterTable
ALTER TABLE "public"."EventMessage" ADD COLUMN     "has_avatar" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_AI_gen" BOOLEAN NOT NULL DEFAULT true;
