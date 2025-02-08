/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Sub` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age` to the `Adm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adm" ADD COLUMN     "age" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sub_name_key" ON "Sub"("name");
