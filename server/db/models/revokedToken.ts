import { Schema, model } from 'mongoose'

import type { IRevokedToken } from '../types/revokedToken'

export const RevokedTokenSchema = new Schema<IRevokedToken>({
    expireAt: { type: Date, required: true },
    identifier: { type: String, required: true }
})

RevokedTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

export default model('RevokedToken', RevokedTokenSchema)
