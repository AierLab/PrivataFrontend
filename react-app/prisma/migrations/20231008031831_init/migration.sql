-- CreateTable
CREATE TABLE "ReviewConversationStorage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profile_id" TEXT NOT NULL DEFAULT '',
    "RequestUserID" TEXT NOT NULL,
    "RequestMessage" TEXT NOT NULL,
    "fileInfoId" INTEGER NOT NULL,
    CONSTRAINT "ReviewConversationStorage_fileInfoId_fkey" FOREIGN KEY ("fileInfoId") REFERENCES "ReviewFileInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewFileInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "filetype" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewConversationStorage_id_key" ON "ReviewConversationStorage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewFileInfo_id_key" ON "ReviewFileInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewFileInfo_hash_key" ON "ReviewFileInfo"("hash");
