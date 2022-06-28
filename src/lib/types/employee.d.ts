import { Role } from './enums/employee'

export interface IEmployee {
    id: number,
    name: string,
    pin?: string,
    role: Role
}