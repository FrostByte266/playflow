import { Schema, model } from 'mongoose'
import type { IEmployee } from '../types/employee.d'
import { Roles } from '../types/enums/employee'

const EmployeeSchema = new Schema<IEmployee>({
    ID: { type: Number, required: true },
    name: { type: String, required: true },
    pin: { type: String, required: true },
    role: {type: String, enum: Object.values(Roles), default: Roles.CAST_MEMBER}
})

export default model('Employee', EmployeeSchema)