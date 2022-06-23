/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: {
			name: string,
			ID: number,
			role: string,
			_id: string
		}
	}
	// interface Platform {}
	interface Session {
		user: {
			name: string,
			ID: number,
			role: string,
			_id: string
		}
	}
	// interface Stuff {}
}
