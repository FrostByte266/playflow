import type { TapTimes } from './enums/gameTap'
import type { IEmployee } from './employee'
import type { IGame } from './game'
import type { Types } from 'mongoose'

export interface IGameTap {
    date: Date,
    time: TapTimes,
    performedBy: IEmployee,
    tappedGames: Types.DocumentArray<IGame>
}