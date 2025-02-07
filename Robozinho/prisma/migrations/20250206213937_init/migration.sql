-- CreateTable
CREATE TABLE "Adm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userWtp" TEXT NOT NULL,

    CONSTRAINT "Adm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Adm_user_key" ON "Adm"("user");
