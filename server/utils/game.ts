import axios from 'axios'
import getFullURL from './url'

import type { Request } from 'express'
import type { HydratedDocument } from 'mongoose'
import type { IGame } from '../db/types/game'

export async function nextGame(req: Request, gameId: number): Promise<HydratedDocument<IGame | null>> {
    const res = await axios.get(`${getFullURL(req)}/games/${gameId}/next`, {
        headers: {
            'X-Internal-Request': process.env.INTERNAL_REQUEST_KEY || ''
        }
    })
    return await res.data
}