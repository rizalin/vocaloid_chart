/*
  Warnings:

  - You are about to drop the column `commentModifier` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `likeModifier` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `viewModifier` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `week` on the `Performance` table. All the data in the column will be lost.
  - Added the required column `bestPosition` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeksInChart` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Performance` DROP COLUMN `commentModifier`,
    DROP COLUMN `likeModifier`,
    DROP COLUMN `month`,
    DROP COLUMN `position`,
    DROP COLUMN `score`,
    DROP COLUMN `viewModifier`,
    DROP COLUMN `week`,
    ADD COLUMN `bestPosition` INTEGER NOT NULL,
    ADD COLUMN `weeksInChart` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `WeekPerformance` (
    `id` VARCHAR(191) NOT NULL,
    `performanceId` VARCHAR(191) NOT NULL,
    `week` INTEGER NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `viewModifier` DECIMAL(65, 30) NOT NULL,
    `viewPoint` INTEGER NOT NULL,
    `likeModifier` DECIMAL(65, 30) NOT NULL,
    `likePoint` INTEGER NOT NULL,
    `commentModifier` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WeekPerformance` ADD FOREIGN KEY (`performanceId`) REFERENCES `Performance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
