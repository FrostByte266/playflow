/* eslint-disable no-var */
import Redis from 'ioredis'

// Declare prisma inside a global scope to prevent
// creating many connections during development
// due to HMR

var redis = globalThis.redis || new Redis()

if (process.env.NODE_ENV === 'development') globalThis.redis = redis

export default redis