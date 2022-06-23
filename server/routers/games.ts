import { Router } from 'express'
import type { IGame } from '../db/types/game'
import guardError from '../utils/guardError'

import Games from '../db/models/game'

import issuesRouter from './issues'

const router = Router()

router.use(issuesRouter)

router.route('/')
    .post((req, res) => {
        Games.create(req.body)
            .then(game => res.json(game))
            .catch(err => res.status(500).json(err))
    })
    .get((req, res) => {
        Games.find({}, undefined, guardError<IGame>(res, {}, games => {
            res.json(games)
        }))
    })

router.route('/:id')
    .get((req, res) => {
        Games.findById(req.params.id, undefined, guardError<IGame>(res, {}, game => {
            res.json(game)
        }))
    })
    .patch((req, res) => {
        Games.findByIdAndUpdate(req.params.id, 
            { $set: req.body },
            { new: true },
            guardError<IGame>(res, {}, game => {
                res.json(game)
            })
        )
    })
    .delete((req, res) => {
        Games.findByIdAndDelete(req.params.id, undefined, guardError<IGame>(res, {}, game => {
            res.json({deleted: game})
        }))
    })

router.get('/:id/next', (req, res) => {
    const gameId = Number(req.params.id)
    Games.findOne({ cardTapPosition: gameId + 1}, guardError<IGame>(res, {}, game => {
        res.json(game)
    }))
})



export default router