/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose, { Schema, model } from 'mongoose'
import type { IGame } from '../types/game.d'
import { GameIssueSchema } from './issue'
// @ts-ignore
import SerialFactory from 'mongoose-sequence'

const Serial = SerialFactory(mongoose)

const GameSchema = new Schema<IGame>({
    name: { type: String, required: true },
    playerCount: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    photo: { type: String, required: true },
    issues: [GameIssueSchema]
})

// Sets a field that auto increments as a default
GameSchema.plugin(Serial, {inc_field: 'cardTapPosition'})

export default model('Game', GameSchema)