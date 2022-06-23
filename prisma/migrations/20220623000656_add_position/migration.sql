/*
  Warnings:

  - A unique constraint covering the columns `[gameTapPosition]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameTapPosition" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameTapPosition_key" ON "Game"("gameTapPosition");
