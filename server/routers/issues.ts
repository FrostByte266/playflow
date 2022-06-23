import { Router } from 'express'
import Codes from 'http-status-codes'

import guardError from '../utils/guardError'

import Games from '../db/models/game'
import type { IGame, IGameIssue } from '../db/types/game'
import type { Types } from 'mongoose'


const router = Router()

router.get('/issues', (req, res) => {
    Games.find({}, 'issues')
        .populate('issues.reportedBy')
        .exec(((err, games) => {
            // TODO: Figure out how to type guardError to actually work with single values or arrays
            const gamesArr = ((games as unknown) as Types.DocumentArray<IGame>)
            const entries = gamesArr.map<[string, Types.DocumentArray<IGameIssue>]>(doc => [String(doc._id), doc.issues])
            res.json(Object.fromEntries(entries))
        }))
})

router.route('/:gameId/issues')
    .get((req, res) => {
        Games.findById(req.params.gameId, 'issues')
            .populate('issues.reportedBy')
            .exec(guardError<IGame>(res, {}, doc => {
                if(doc !== null) {
                    res.json(doc.issues)
                }
            }))
    })
    .post((req, res) => {
        Games.findByIdAndUpdate(req.params.gameId,
            {
                $push: { 'issues': req.body }
            },
            { new: true },
            guardError<IGame>(res, {}, updated => {
                    res.json(updated?.issues.at(-1))
                }
            )
        )
    })

router.route('/:gameId/issues/:issueId')
    .get((req, res) => {
        Games.findById(req.params.gameId, 'issues')
        .populate('issues.reportedBy')
        .exec(guardError<IGame>(res, {}, game => {
                const issue = game?.issues.id(req.params.issueId)
                res.json(issue)
        }))
    })
    .patch((req, res) => {
        Games.findById(req.params.gameId, 'issues', guardError<IGame>(res, {}, doc => {
            const currentDoc = doc?.issues.id(req.params.issueId)
            if(currentDoc) {
                currentDoc.set(req.body)
                doc?.save((e) => {
                    if(e) {
                        res.status(Codes.BAD_REQUEST).json(e)
                    } else {
                        res.json(currentDoc)
                    }
                })
            } else {
                res.status(Codes.NOT_FOUND).json({err: 'No issue found'})
            }
        }))
    })
    .delete((req, res) => {
        Games.findByIdAndUpdate(req.params.gameId, {
            $pull: {
                issues: { _id: req.params.issueId}
            }
        },
        { new: true},
        guardError<IGame>(res, {}, () => {
            res.json({deleted: req.params.issueId })
        }))
    })

export default router