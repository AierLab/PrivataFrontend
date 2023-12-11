/*
  Warnings:

  - You are about to drop the column `filePath` on the `ReviewStorage` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `ReviewStorage` table. All the data in the column will be lost.
  - You are about to drop the column `filesize` on the `ReviewStorage` table. All the data in the column will be lost.
  - You are about to drop the column `filetype` on the `ReviewStorage` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `ReviewStorage` table. All the data in the column will be lost.
  - Added the required column `fileStorageHash` to the `ReviewStorage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "FileStorage" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "file" BLOB NOT NULL,
    "filePath" TEXT,
    "filename" TEXT,
    "filesize" INTEGER,
    "filetype" TEXT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewStorage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profile_id" TEXT NOT NULL DEFAULT '',
    "RequestMessage" TEXT,
    "RequestUser" TEXT NOT NULL,
    "mentioned" TEXT NOT NULL DEFAULT '',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fileStorageHash" TEXT NOT NULL,
    CONSTRAINT "ReviewStorage_fileStorageHash_fkey" FOREIGN KEY ("fileStorageHash") REFERENCES "FileStorage" ("hash") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReviewStorage" ("RequestMessage", "RequestUser", "createdAt", "deleted", "id", "mentioned", "profile_id", "updatedAt") SELECT "RequestMessage", "RequestUser", "createdAt", "deleted", "id", "mentioned", "profile_id", "updatedAt" FROM "ReviewStorage";
DROP TABLE "ReviewStorage";
ALTER TABLE "new_ReviewStorage" RENAME TO "ReviewStorage";
CREATE UNIQUE INDEX "ReviewStorage_id_key" ON "ReviewStorage"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "FileStorage_hash_key" ON "FileStorage"("hash");
