/*
  Warnings:

  - You are about to drop the column `gameTapId` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_gameTapId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameTapId";

-- CreateTable
CREATE TABLE "GameOnGameTap" (
    "gameId" INTEGER NOT NULL,
    "tapId" INTEGER NOT NULL,

    CONSTRAINT "GameOnGameTap_pkey" PRIMARY KEY ("gameId","tapId")
);

-- AddForeignKey
ALTER TABLE "GameOnGameTap" ADD CONSTRAINT "GameOnGameTap_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameOnGameTap" ADD CONSTRAINT "GameOnGameTap_tapId_fkey" FOREIGN KEY ("tapId") REFERENCES "GameTap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
