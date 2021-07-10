/*
  Warnings:

  - You are about to drop the column `performance` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `statistic` on the `Statistic` table. All the data in the column will be lost.
  - Added the required column `commentModifier` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likeModifier` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewModifier` to the `Performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comments` to the `Statistic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes` to the `Statistic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `views` to the `Statistic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `week` to the `Statistic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Performance` DROP COLUMN `performance`,
    ADD COLUMN `commentModifier` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `likeModifier` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `position` INTEGER NOT NULL,
    ADD COLUMN `score` INTEGER NOT NULL,
    ADD COLUMN `viewModifier` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Statistic` DROP COLUMN `statistic`,
    ADD COLUMN `comments` INTEGER NOT NULL,
    ADD COLUMN `likes` INTEGER NOT NULL,
    ADD COLUMN `views` INTEGER NOT NULL,
    ADD COLUMN `week` INTEGER NOT NULL;
