/*
  Warnings:

  - You are about to drop the column `published` on the `Memory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER,
    "yearMin" INTEGER,
    "yearMax" INTEGER,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Memory_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Memory" ("createdAt", "deleted", "description", "fileId", "id", "modifiedAt", "title", "userId", "year", "yearMax", "yearMin") SELECT "createdAt", "deleted", "description", "fileId", "id", "modifiedAt", "title", "userId", "year", "yearMax", "yearMin" FROM "Memory";
DROP TABLE "Memory";
ALTER TABLE "new_Memory" RENAME TO "Memory";
CREATE UNIQUE INDEX "Memory_fileId_key" ON "Memory"("fileId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
