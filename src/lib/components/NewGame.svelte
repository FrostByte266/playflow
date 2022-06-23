<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    import type { IGame } from '$lib/types/game'
    import toggleable from '$lib/utils/toggleStore';
    import identifierFactory from '$lib/utils/uniqueID'
    import type { Optional } from '$lib/types/utility'

    let newGame: Optional<IGame>

    const editing = toggleable(false)

    const dispatcher = createEventDispatcher()

    function finalizeCreation() {
        // When the API is connected, this is where
        // the update request would be sent
        dispatcher('created', newGame)
        editing.toggle() // Collapses the component
        newGame = undefined
        console.log('Finished editing')
    }

    function startCreation() {
        newGame = {
            name: '',
            manufacturer: '',
            photo: '',
            playerCount: 1
        }
        editing.toggle()
    }

    function cancelCreation() {
        newGame = undefined
        editing.toggle()
    }

    const uniqueIDs = identifierFactory(['name', 'photo', 'playerCount', 'manufacturer'], 'newGame')

    
</script>


<div class="even:bg-gray-300 odd:bg-gray-400 flex my-5 p-5 items-center justify-around mx-5">
    {#if $editing && typeof newGame !== 'undefined'}
    <div class="flex flex-grow flex-col items-center justify-around gap-3">
        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.name}>Game Name</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.name} type="text" disabled={!$editing} bind:value={newGame.name}>
        </div>

        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.manufacturer}>Manufacturer</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.manufacturer} type="text" disabled={!$editing} bind:value={newGame.manufacturer}>
        </div>
        
        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.photo}>Image URL</label>
            <input class="p-1 rounded-lg w-1/2" id={uniqueIDs.photo} type="text" disabled={!$editing} bind:value={newGame.photo}>
        </div>

        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.playerCount}>Player Count</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.playerCount} type="number" min={0} disabled={!$editing} bind:value={newGame.playerCount}>
        </div>
    </div>

    <div class="flex flex-col items-center justify-around">
        <h1 class="text-lg">Actions</h1>
        <button class="p-2 text-center rounded-full border border-black m-2" on:click={finalizeCreation}>Save</button>
        <button class:opacity-0={!$editing} class="p-2 text-center rounded-full border border-black m-2 row-start-2" on:click={cancelCreation}>Cancel</button>
    </div>
    {:else}
        <svg xmlns="http://www.w3.org/2000/svg" on:click={startCreation} class="w-[50px] transition-transform cursor-pointer hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
    {/if}
</div>

