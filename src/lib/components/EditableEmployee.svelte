<script lang="ts">
    import type { IEmployee } from '$lib/types/employee'
    import { Roles } from '$lib/types/enums/employee'
    import identifierFactory from '$lib/utils/uniqueID'
    import toggleable from '$lib/utils/toggleStore'

    export let employee: IEmployee

    let originalEmployee: IEmployee = JSON.parse(JSON.stringify(employee)) // Making a copy incase user wants to revert

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
        employee = originalEmployee
        editing.toggle()
    }

    const uniqueIDs = identifierFactory(['name', 'role'], employee.ID.toString())

    
</script>



<div class="even:bg-gray-300 odd:bg-gray-400 flex my-5 p-5 items-center justify-around mx-5">
    <div class="flex flex-col items-center justify-around gap-3">
        <label for={uniqueIDs.name}>Employee name (First + Last)</label>
        <input for={uniqueIDs.name} type="text" disabled={!$editing} bind:value={employee.name} >
    </div>
    <div class="flex flex-col items-center justify-around gap-3">
        <label for={uniqueIDs.role}>Role</label>
        <select id={uniqueIDs.role} bind:value={employee.role} disabled={!$editing}>
            <!-- Ensures that the select menu resets if edits are cancelled-->
            {#key employee.role}
                {#each Object.values(Roles) as role}
                    <option selected={employee.role === role}>{role}</option>
                {/each}
            {/key}
        </select>
    </div>
    <div class="flex flex-col items-center justify-around">
        <p class="p-2 text-center rounded-full border border-black m-2" on:click={toggleEdit}>{$editing ? "Save" : "Edit"}</p>
        <p class:opacity-0={!$editing} class="p-2 text-center rounded-full border border-black m-2 row-start-2" on:click={cancelEdit}>Cancel Edits</p>
    </div>
</div>

