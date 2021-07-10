/*
  Warnings:

  - You are about to drop the column `voiceBankId` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_ibfk_2`;

-- AlterTable
ALTER TABLE `Video` DROP COLUMN `voiceBankId`,
    ADD COLUMN `voiceBank` VARCHAR(191);
