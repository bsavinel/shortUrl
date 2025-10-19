/*
  Warnings:

  - The values [CLICKLIMIT,EXPIRE] on the enum `ShortUrlType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShortUrlType_new" AS ENUM ('DEFAULT', 'LIMITED');
ALTER TABLE "shortUrl" ALTER COLUMN "type" TYPE "ShortUrlType_new" USING ("type"::text::"ShortUrlType_new");
ALTER TYPE "ShortUrlType" RENAME TO "ShortUrlType_old";
ALTER TYPE "ShortUrlType_new" RENAME TO "ShortUrlType";
DROP TYPE "public"."ShortUrlType_old";
COMMIT;
