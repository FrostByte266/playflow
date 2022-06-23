import { Roles } from './enums/employee'

export interface IEmployee {
    ID: number,
    name: string,
    pin: string,
    role: Roles
}