import { Router } from 'express'
import type { IGameTap } from '../db/types/gameTap'
import type { IGame, IGameIssue } from '../db/types/game'
import type { ITapUpdateBody } from '../types/bodies/gameTap'
import type { HydratedDocument } from 'mongoose'
import guardError from '../utils/guardError'

import GameTap from '../db/models/gameTap'
import Game from '../db/models/game'

import { nextGame } from '../utils/game'
import { createIssue, updateIssue } from '../utils/issue'

const router = Router()

router.route('/')
    .post((req, res) => {
        GameTap.create(req.body, guardError<IGameTap>(res, {}, tap => {
            Game.findOne({cardTapPosition: 1}, undefined, guardError<IGame>(res, {}, game => {
                res.json({tap, firstGame: game})
            }))
        }))
            
    })
    .get((req, res) => {
        GameTap.find({}, undefined, guardError<IGameTap>(res, {}, taps => {
            res.json(taps)
        }))
    })

router.route('/:id')
    .get((req, res) => {
        GameTap.findById(req.params.id, undefined, guardError<IGameTap>(res, {}, game => {
            res.json(game)
        }))
    })
    .patch((req, res) => {
        GameTap.findByIdAndUpdate(req.params.id, 
            { $set: req.body },
            { new: true },
            guardError<IGameTap>(res, {}, game => res.json(game))
        )
    })
    .delete((req, res) => {
        GameTap.findByIdAndDelete(req.params.id, undefined, guardError<IGameTap>(res, {}, game => {
            res.json({deleted: game})
        }))
    })

router.route('/:tapId/:gameId')
    .post(async (req, res) => {
        const body: ITapUpdateBody = req.body
        if(typeof body.new === 'undefined') {
            body.new = []
        }

        if(typeof body.update === 'undefined') {
            body.update = []
        }
        const created = await Promise.all(
                body.new.map<Promise<HydratedDocument<IGameIssue>>>(async newIssue => {
                return await createIssue(req, req.params.gameId, newIssue)
            })
        )
        const updated = await Promise.all(
                body.update.map<Promise<HydratedDocument<IGameIssue>>>(async updatedIssue => {
                return await updateIssue(req, req.params.gameId, String(updatedIssue._id), updatedIssue)
            })
        )
        GameTap.findByIdAndUpdate(req.params.tapId, {
            $push: {tappedGames: req.params.gameId}
        }, undefined, guardError<IGameTap>(res, {}, async () => {
            res.json({
                next: await nextGame(req, body.currentIdx),
                created,
                updated
            })
        }))
    })

export default router