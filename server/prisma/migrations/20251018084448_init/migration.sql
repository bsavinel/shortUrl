-- CreateEnum
CREATE TYPE "ShortUrlType" AS ENUM ('DEFAULT', 'CLICKLIMIT', 'EXPIRE');

-- CreateTable
CREATE TABLE "url" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shortUrl" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "urlId" TEXT,
    "type" "ShortUrlType" NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "limit" INTEGER,
    "expireAt" TIMESTAMP(3),
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_url_key" ON "url"("url");

-- CreateIndex
CREATE UNIQUE INDEX "shortUrl_shortUrl_key" ON "shortUrl"("shortUrl");

-- AddForeignKey
ALTER TABLE "shortUrl" ADD CONSTRAINT "shortUrl_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "url"("id") ON DELETE SET NULL ON UPDATE CASCADE;
