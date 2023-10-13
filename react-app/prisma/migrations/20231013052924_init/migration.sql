/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `RequestUserID` on the `ReviewConversationStorage` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `RequestUser` to the `ReviewConversationStorage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReviewConversationStorage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReviewFileInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewConversationStorage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profile_id" TEXT NOT NULL DEFAULT '',
    "RequestMessage" TEXT,
    "RequestUser" TEXT NOT NULL,
    "fileInfoId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReviewConversationStorage_fileInfoId_fkey" FOREIGN KEY ("fileInfoId") REFERENCES "ReviewFileInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReviewConversationStorage" ("RequestMessage", "fileInfoId", "id", "profile_id") SELECT "RequestMessage", "fileInfoId", "id", "profile_id" FROM "ReviewConversationStorage";
DROP TABLE "ReviewConversationStorage";
ALTER TABLE "new_ReviewConversationStorage" RENAME TO "ReviewConversationStorage";
CREATE UNIQUE INDEX "ReviewConversationStorage_id_key" ON "ReviewConversationStorage"("id");
CREATE TABLE "new_ReviewFileInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "filetype" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ReviewFileInfo" ("deleted", "filePath", "filename", "filesize", "filetype", "hash", "id") SELECT "deleted", "filePath", "filename", "filesize", "filetype", "hash", "id" FROM "ReviewFileInfo";
DROP TABLE "ReviewFileInfo";
ALTER TABLE "new_ReviewFileInfo" RENAME TO "ReviewFileInfo";
CREATE UNIQUE INDEX "ReviewFileInfo_id_key" ON "ReviewFileInfo"("id");
CREATE TABLE "new_User" (
    "phone" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "avatar" TEXT,
    "reviewConversationStorageId" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_reviewConversationStorageId_fkey" FOREIGN KEY ("reviewConversationStorageId") REFERENCES "ReviewConversationStorage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("avatar", "deleted", "name") SELECT "avatar", "deleted", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
