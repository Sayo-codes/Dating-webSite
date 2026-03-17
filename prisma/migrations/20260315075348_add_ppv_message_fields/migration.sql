-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isPPV" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ppvPriceCents" INTEGER;
