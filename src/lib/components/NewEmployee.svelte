<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    import type { IEmployee } from '$lib/types/employee'
    import { Roles } from '$lib/types/enums/employee'
    import toggleable from '$lib/utils/toggleStore';
    import identifierFactory from '$lib/utils/uniqueID'
    import type { Optional } from '$lib/types/utility'

    let newEmployee: Optional<IEmployee>

    const editing = toggleable(false)

    const dispatcher = createEventDispatcher()

    function finalizeCreation() {
        // When the API is connected, this is where
        // the update request would be sent
        dispatcher('created', newEmployee)
        editing.toggle() // Collapses the component
        newEmployee = undefined
        console.log('Finished editing')
    }

    function startCreation() {
        newEmployee = {
            name: '',
            ID: 0,
            pin: '',
            role: Roles.CAST_MEMBER
        }
        editing.toggle()
    }

    function cancelCreation() {
        newEmployee = undefined
        editing.toggle()
    }

    const uniqueIDs = identifierFactory(['name', 'ID', 'pin', 'role'], 'newGame')

    
</script>


<div class="even:bg-gray-300 odd:bg-gray-400 flex my-5 p-5 items-center justify-around mx-5">
    {#if $editing && typeof newEmployee !== 'undefined'}
    <div class="flex flex-grow flex-col items-center justify-around gap-3">
        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.name}>Full Name (First + Last)</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.name} type="text" disabled={!$editing} bind:value={newEmployee.name}>
        </div>

        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.ID}>EmployeeID</label>
            <input class="p-1 rounded-lg" id={uniqueIDs.ID} type="number" min={0} disabled={!$editing} bind:value={newEmployee.ID}>
        </div>
        
        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.pin}>PIN Number</label>
            <input class="p-1 rounded-lg w-1/2" id={uniqueIDs.pin} type="number" min={0} disabled={!$editing} bind:value={newEmployee.pin}>
        </div>

        <div class="flex gap-3 w-full items-center justify-center">
            <label for={uniqueIDs.role}>Role</label>
            <select id={uniqueIDs.role} bind:value={newEmployee.role} disabled={!$editing}>
                <!-- Ensures that the select menu resets if edits are cancelled-->
                {#key newEmployee.role}
                    {#each Object.values(Roles) as role}
                        <option>{role}</option>
                    {/each}
                {/key}
            </select>
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

