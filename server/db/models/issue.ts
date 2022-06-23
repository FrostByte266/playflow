import { Schema, model } from 'mongoose'
import type { IGameIssue } from '../types/game.d'
import * as Issue from '../types/enums/issue'

export const GameIssueSchema = new Schema<IGameIssue>({
    description: { type: String, required: true},
    reportedBy: { type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    date: { type: Date, required: true},
    type: {type: String, enum: Object.values(Issue.Type), required: true},
    state: {type: String, enum: Object.values(Issue.Status), default: Issue.Status.REPORTED}
})

export default model('GameIssue', GameIssueSchema)