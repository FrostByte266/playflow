<script lang="ts" context="module">
    import apiRoute, { defaultFetchProps } from '$lib/utils/apiRoute'
    import type { Load } from './__types/[game]'
    import type { IGame } from '$lib/types/game'

    export const load: Load = async ({ fetch, params }) => {
        const gameRes = await fetch(apiRoute(`/games/${params.game}`), defaultFetchProps)
        const gameData: IGame = await gameRes.json()

        const nextRes = await fetch(apiRoute(`/games/${gameData.cardTapPosition}/next`), defaultFetchProps)
        return {
            props: {
                current: gameData,
                next: await nextRes.json(),
                tapId: params.tap
            }
        }
    }
</script>

<script lang="ts">
    import EmployeeInfo from '$lib/components/EmployeeInfo.svelte'

    import { Type as IssueType } from '$lib/types/enums/issue'

    import { session } from '$app/stores'
    import { goto } from '$app/navigation'

    export let tapId: string
    export let current: IGame
    export let next: IGame | null


    interface NewIssue {
        issueType: IssueType,
        description: string
    }
    
    let newIssues: Array<NewIssue> = []
    let issueBoxes: Array<HTMLTextAreaElement> = []

    const nextPath = next !== null ? `/gametap/${tapId}/${next._id}` : '/'

    function addIssue(issueType: IssueType) {
        const exists = newIssues.findIndex(i => i.issueType === issueType)
        if(exists !== -1) {
            issueBoxes[exists].focus()
        } else {
            newIssues = [...newIssues, { description: '', issueType }]
        }
    }

    function cancelIssueCreation(issueType: IssueType) {
        const exists = newIssues.findIndex(i => i.issueType === issueType)
        if(exists !== -1) {
            newIssues = newIssues.filter(i => i.issueType !== issueType)
        }
    }

    async function saveAndContinue(e: MouseEvent) {
        e.preventDefault()
        console.log(nextPath)
        await fetch(apiRoute(`/tap/${tapId}/${current._id}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentIdx: current.cardTapPosition,
                new: newIssues.map(issue => ({
                    description: issue.description,
                    reportedBy: $session.user._id,
                    date: new Date(),
                    type: issue.issueType,
                }))
            }),
            ...defaultFetchProps
        })

        newIssues = []
        goto(nextPath)

    }

</script>

<svelte:head>
    <title>GameTap</title>
</svelte:head>

<div class="flex justify-between items-center">
    <h1 class="text-3xl text-center pl-5 select-none cursor-default">A.M. Card Tap</h1>
    <div class="p-5">
        <EmployeeInfo employee={$session.user} />
    </div>
</div>

<div class="flex flex-col gap-2 bg-gray-300 p-5">
    <h1 class="text-xl">{current.name}</h1>
    <div class="flex gap-5 items-center justify-around">
        <img src={current.photo} alt={current.name}>
        <div class="bg-gray-400 flex flex-col p-5">
            <h1 class="text-xl">Select any that apply:</h1>
            <div class="flex gap-20 items-center justify-between">
                <div on:click={() => addIssue(IssueType.DOWN)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-center">Game Down</p>
                </div>
                <div on:click={() => addIssue(IssueType.SAFTEY)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-center">Safety</p>
                </div>
                <div on:click={() => addIssue(IssueType.NON_CRITICAL)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-center">Non-critical issue</p>
                </div>
                <div on:click={() => addIssue(IssueType.CLEANING)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-center">Needs Cleaning</p>
                </div>
            </div>
        </div>

        <div class:opacity-0={newIssues.length === 0} class="bg-gray-400 flex flex-col p-5 gap-3 transition-opacity">
            <h1 class="text-xl">Please enter details for the following issue(s)</h1>
            {#each newIssues as issue, i}
                <div class="border-black border-[3px] p-2 relative">
                    <p class="cursor-pointer text-right absolute right-2 top-1" on:click={() => cancelIssueCreation(issue.issueType)}>X</p>
                    <h2 class="text-lg">{issue.issueType}</h2>
                    <textarea bind:this={issueBoxes[i]} bind:value={newIssues[i].description}></textarea>
                </div>
            {/each}
        </div>
    </div> 
    <a class="text-right" href={nextPath}>
        Game Occupied? Save for later
        <svg xmlns="http://www.w3.org/2000/svg" class="inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
    </a>
    

</div>

    <a href="_blank" class="my-5 p-2 group" on:click={saveAndContinue}>
        <h1 class="text-center bg-gray-300 p-2">
            {#if next !== null}
                Up next: {next.name}
            {:else}
                Complete Tap
            {/if}
            <svg xmlns="http://www.w3.org/2000/svg" class="transition-transform group-hover:translate-x-2 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
        </h1>
    </a>
