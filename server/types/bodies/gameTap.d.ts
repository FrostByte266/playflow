import type { IGameIssue } from '../../db/types/game'
import type { HydratedDocument, Types } from 'mongoose'

export interface IUpdatableIssue extends Partial<HydratedDocument<IGameIssue>> {
     _id: Types.ObjectId
}

export interface ITapUpdateBody {
    currentIdx: number
    new: Array<IGameIssue>
    update: Array<IUpdatableIssue>
}
