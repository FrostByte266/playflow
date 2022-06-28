/* eslint-disable no-var */
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Redis } from 'ioredis'
import type { PrismaClient, Employee } from '@prisma/client'
import type { JwtPayload } from 'jsonwebtoken'

declare global {
	declare namespace App {
		interface Locals {
			user: {
				name: string,
				id: number,
				role: string,
			},
			token: Required<JwtPayload> & Employee
		}
		// interface Platform {}
		interface Session {
			user: {
				name: string,
				id: number,
				role: string,
			}
		}
		// interface Stuff {}
	}
	
	interface ImportMetaEnv {
		VITE_JWT_SECRET: string
	}

	var redis: Redis
	var prisma: PrismaClient
	
}
