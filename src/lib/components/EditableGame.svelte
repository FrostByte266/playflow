<script lang="ts">
    import type { IGame } from '$lib/types/game'
    import identifierFactory from '$lib/utils/uniqueID'
    import toggleable from '$lib/utils/toggleStore'

    export let game: IGame

    let originalGame: IGame = JSON.parse(JSON.stringify(game)) // Making a copy incase user wants to revert

    const editing = toggleable(false)

    function toggleEdit() {
        if (editing) {
            // When the API is connected, this is where
            // the update request would be sent
            console.log('Finished editing')
        }
        editing.toggle()
    }

    function cancelEdit() {
        game = originalGame
        editing.toggle()
    }

    const uniqueIDs = identifierFactory(Object.keys(game), game.name)

    
</script>


<div class="even:bg-gray-300 odd:bg-gray-400 flex my-5 p-5 items-center justify-around mx-5">
    <div class="flex flex-grow flex-col items-center justify-around gap-3">
        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.name}>Game Name</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.name} type="text" disabled={!$editing} bind:value={game.name}>
        </div>

        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.manufacturer}>Manufacturer</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.manufacturer} type="text" disabled={!$editing} bind:value={game.manufacturer}>
        </div>
        
        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.photo}>Image URL</label>
            <input class="p-1 rounded-lg w-1/2" id={uniqueIDs.photo} type="text" disabled={!$editing} bind:value={game.photo}>
        </div>

        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.playerCount}>Player Count</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.playerCount} type="number" min={0} disabled={!$editing} bind:value={game.playerCount}>
        </div>
    </div>

    <div class="flex flex-col items-center justify-around">
        <h1 class="text-lg">Actions</h1>
        <p class="p-2 text-center rounded-full border border-black m-2" on:click={toggleEdit}>{$editing ? "Save" : "Edit"}</p>
        <p class:opacity-0={!$editing} class="p-2 text-center rounded-full border border-black m-2 row-start-2" on:click={cancelEdit}>Cancel Edits</p>
        <p class:opacity-0={!$editing} class="p-2 text-center rounded-full border border-black m-2 row-start-2" on:click={cancelEdit}>Delete</p>
    </div>
</div>

