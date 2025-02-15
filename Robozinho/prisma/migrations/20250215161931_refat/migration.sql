-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "userWtp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "subRole" TEXT,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "memberId" INTEGER,
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
CREATE TABLE "MemberSub" (
    "memberId" INTEGER NOT NULL,
    "subId" INTEGER NOT NULL,

    CONSTRAINT "MemberSub_pkey" PRIMARY KEY ("memberId","subId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_user_key" ON "Member"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Sub_name_key" ON "Sub"("name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSub" ADD CONSTRAINT "MemberSub_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSub" ADD CONSTRAINT "MemberSub_subId_fkey" FOREIGN KEY ("subId") REFERENCES "Sub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
