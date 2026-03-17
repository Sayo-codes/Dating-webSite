-- AlterTable
ALTER TABLE "creators" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "followerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscriberCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalLikes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "creator_posts" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "caption" TEXT,
    "previewUrl" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" "CreatorMediaType" NOT NULL DEFAULT 'IMAGE',
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "unlockPriceCents" INTEGER NOT NULL DEFAULT 1999,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "creator_posts_creatorId_idx" ON "creator_posts"("creatorId");

-- AddForeignKey
ALTER TABLE "creator_posts" ADD CONSTRAINT "creator_posts_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
