/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToMemory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MemoryToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CategoryToMemory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MemoryToTag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MemoryCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MemoryTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MemoryToMemoryCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MemoryToMemoryCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Memory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MemoryToMemoryCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "MemoryCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MemoryToMemoryTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MemoryToMemoryTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Memory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MemoryToMemoryTag_B_fkey" FOREIGN KEY ("B") REFERENCES "MemoryTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MemoryToMemoryCategory_AB_unique" ON "_MemoryToMemoryCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_MemoryToMemoryCategory_B_index" ON "_MemoryToMemoryCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MemoryToMemoryTag_AB_unique" ON "_MemoryToMemoryTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MemoryToMemoryTag_B_index" ON "_MemoryToMemoryTag"("B");
