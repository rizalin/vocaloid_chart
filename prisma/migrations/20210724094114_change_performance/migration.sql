/*
  Warnings:

  - Added the required column `month` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `week` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Performance` ADD COLUMN `month` VARCHAR(191) NOT NULL,
    ADD COLUMN `week` INTEGER NOT NULL;
