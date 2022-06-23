<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import type { IGameIssue } from '$lib/types/game'
    import { Status } from '$lib/types/enums/issue'
    import toggleable from '$lib/utils/toggleStore'
    import { session } from '$app/stores'
    import apiRoute, { defaultFetchProps } from '$lib/utils/apiRoute'

    const dispatch = createEventDispatcher()

    export let issue: IGameIssue


    let originalIssue: IGameIssue = {...issue} // Making a copy incase user wants to revert

    const editing = toggleable(false)

    async function toggleEdit() {
        if ($editing) {
            // When the API is connected, this is where
            // the update request would be sent
            console.log('Finished editing')
            const { description, state } = issue
            const res = await fetch(apiRoute(`/games/${issue.game._id}/issues/${issue._id}`), { 
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { description, state }
                ),
                ...defaultFetchProps
            })
            originalIssue = {...issue}
        }
        editing.toggle()
    }

    function cancelEdit() {
        issue = { ...originalIssue }
        editing.toggle()
    }

    function deleteIssue(e: MouseEvent) {
        e.preventDefault()
        dispatch('delete', issue)
    }

    async function markResolved(e: MouseEvent) {
        e.preventDefault()
        const res = await fetch(apiRoute(`/games/${issue.game._id}/issues/${issue._id}`), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                state: 'Issue Resolved'
            }),
            ...defaultFetchProps
        })

        const data = await res.json()
        data.game = {...issue.game}
        data.reportedBy = {...issue.reportedBy}
        issue = data
    }

</script>

<div class:even:bg-green-200={issue.state === 'Issue Resolved'} class:odd:bg-green-400={issue.state === 'Issue Resolved'} class="my-2 mx-5 p-5 flex justify-between even:bg-gray-300 odd:bg-gray-400" >
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-lg">{issue.game.name}</h1>
        <h1 class="text-lg">Reported on {new Date(issue.date).toLocaleDateString()}</h1>
        <h1 class="text">By: {issue.reportedBy.name} ({String(issue.reportedBy.ID).padStart(9, '0')})</h1>
        <h1 class="text">{issue.reportedBy.role}</h1>
    </div>
    <div class="flex flex-col justify-between items-center">
        <h1 class="text-lg">Issue Type: {issue.type}</h1>
        <h1 class="text-lg">Description:</h1>
        <textarea class="p-2" readonly={!$editing} bind:value={issue.description}></textarea>
    </div>
    <div class="flex flex-col gap-2 justify-center items-center">
        <div class="w-full text bg-gray-500 p-2">Status:
            <select bind:value={issue.state} disabled={!$editing}>
                <!-- Ensures that the select menu resets if edits are cancelled-->
                {#key issue.state}
                    {#each Object.values(Status) as state}
                        <option selected={issue.state === state}>{state}</option>
                    {/each}
                {/key}
            </select>
        </div>
        <div class="w-full flex gap-3 text bg-gray-500 p-2">Actions:
            
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={toggleEdit}>
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {#if $editing }
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={cancelEdit}>
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            {/if}
            {#if $session.user.role.match(/Manager/)}
                <a on:click={markResolved} href="_blank" title="Resolve Issue">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </a>
                <a on:click={deleteIssue} href="_blank" title="Delete Issue">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </a>
            {/if}
        </div>
    </div>
</div>