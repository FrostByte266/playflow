-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CAST_MEMBER', 'MANAGER', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('DOWN', 'SAFETY', 'CLEANING', 'NON_CRITICAL');

-- CreateEnum
CREATE TYPE "IssueState" AS ENUM ('REPORTED', 'CONFIRMED', 'AWAITING_RESOLUTION', 'RESOLVED');

-- CreateEnum
CREATE TYPE "TapTime" AS ENUM ('AM', 'PM');

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'CAST_MEMBER',
    "pin" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "reportedById" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "IssueType" NOT NULL DEFAULT E'DOWN',
    "state" "IssueState" NOT NULL DEFAULT E'REPORTED',

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "gameTapId" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameTap" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" "TapTime" NOT NULL,
    "performedById" INTEGER NOT NULL,

    CONSTRAINT "GameTap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issue_reportedById_key" ON "Issue"("reportedById");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_gameId_key" ON "Issue"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameTap_performedById_key" ON "GameTap"("performedById");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameTapId_fkey" FOREIGN KEY ("gameTapId") REFERENCES "GameTap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTap" ADD CONSTRAINT "GameTap_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
