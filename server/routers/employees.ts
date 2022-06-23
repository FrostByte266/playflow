import { Router } from 'express'
import type { IEmployee } from '../db/types/employee'
import guardError from '../utils/guardError'

import Employees from '../db/models/employee'

const router = Router()

router.get('/preview', (req, res) => {
    Employees.find({}, 'name ID role -_id', guardError<IEmployee>(res, {}, employees => {
        res.json(employees)
    }))
})


router.route('/')
    .post((req, res) => {
        Employees.create(req.body)
            .then(game => res.json(game))
            .catch(err => res.status(500).json(err))
    })
    .get((req, res) => {
        Employees.find({}, undefined, guardError<IEmployee>(res, {}, employees => {
            res.json(employees)
        }))
    })

router.route('/:id')
    .get((req, res) => {
        Employees.findById(req.params.id, undefined, guardError<IEmployee>(res, {}, employee => {
            res.json(employee)
        }))
    })
    .patch((req, res) => {
        Employees.findByIdAndUpdate(req.params.id, 
            { $set: req.body },
            { new: true },
            guardError<IEmployee>(res, {}, employee => {
                res.json(employee)
            })
        )
    })
    .delete((req, res) => {
        Employees.findByIdAndDelete(req.params.id, undefined, guardError<IEmployee>(res, {}, employee => {
            res.json({deleted: employee})
        }))
    })

export default router