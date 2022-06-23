import { writable } from "svelte/store"

export default function toggleable(initial: boolean) {
    const { subscribe, update } = writable<boolean>(initial)
    const toggle = () => update(state => !state)
    return {
        subscribe,
        toggle
    }
}