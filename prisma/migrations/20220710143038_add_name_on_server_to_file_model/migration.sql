/*
  Warnings:

  - Added the required column `nameOnServer` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalName" TEXT NOT NULL,
    "nameOnServer" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT
);
INSERT INTO "new_File" ("createdAt", "id", "mimeType", "originalName", "size") SELECT "createdAt", "id", "mimeType", "originalName", "size" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
