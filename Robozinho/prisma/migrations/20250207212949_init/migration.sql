/*
  Warnings:

  - Added the required column `phone` to the `Adm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Adm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Adm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adm" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userWtp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" INTEGER,
    "adminId" INTEGER,
    "wUrl" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSub" (
    "userId" INTEGER NOT NULL,
    "subId" INTEGER NOT NULL,

    CONSTRAINT "UserSub_pkey" PRIMARY KEY ("userId","subId")
);

-- CreateTable
CREATE TABLE "AdmSub" (
    "admId" INTEGER NOT NULL,
    "subId" INTEGER NOT NULL,

    CONSTRAINT "AdmSub_pkey" PRIMARY KEY ("admId","subId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_key" ON "User"("user");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Adm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSub" ADD CONSTRAINT "UserSub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSub" ADD CONSTRAINT "UserSub_subId_fkey" FOREIGN KEY ("subId") REFERENCES "Sub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmSub" ADD CONSTRAINT "AdmSub_admId_fkey" FOREIGN KEY ("admId") REFERENCES "Adm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmSub" ADD CONSTRAINT "AdmSub_subId_fkey" FOREIGN KEY ("subId") REFERENCES "Sub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
