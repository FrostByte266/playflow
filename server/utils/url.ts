import type { Request } from 'express'

export default function getFullURL(req: Request): string {
    return `${req.protocol}://${req.hostname}:${process.env.PORT || 3100}`
}