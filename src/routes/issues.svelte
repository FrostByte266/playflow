<script lang="ts" context="module">
    import apiRoute, { defaultFetchProps } from '$lib/utils/apiRoute'

    import type { Load } from './__types/issues'
    import type { IGameIssue } from '$lib/types/game'

    export const load: Load = async ({ fetch }) => {
        const res = await fetch(apiRoute('/games/issues'), defaultFetchProps)
        const data = await res.json()
        for(const gameId of Object.keys(data)) {
            const gameRes = await fetch(apiRoute(`/games/${gameId}`), defaultFetchProps)
            const gameData = await gameRes.json()
            data[gameData.name] = data[gameId]
            for(let i=0; i<data[gameData.name].length; i++) {
                data[gameData.name][i].game = gameData
            }
            delete data[gameId]
        }

        return {
            props: {
                issues: data
            }
        }

    }
</script>

<script lang="ts">
    import GameIssue from '$lib/components/GameIssue.svelte'
    import EmployeeInfo from '$lib/components/EmployeeInfo.svelte'

    import { session } from '$app/stores'

    export let issues: {[gameID: string]: Array<IGameIssue>}

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    async function deleteIssue(e: CustomEvent<IGameIssue>) {
        await fetch(apiRoute(`/games/${e.detail.game._id}/issues/${e.detail._id}`), {
            method: 'DELETE',
            ...defaultFetchProps
        })
        issues[e.detail.game.name] = issues[e.detail.game.name].filter(i => i._id !== e.detail._id)
    }

</script>

<svelte:head>
    <title>Review Issues</title>
</svelte:head>


<div class="flex justify-between items-center">
    <h1 class="text-3xl text-center pl-5 select-none cursor-default">Current issues as of {today}</h1>
    <div class="p-5">
        <EmployeeInfo employee={$session.user} />
    </div>
</div>

{#each Object.entries(issues) as [ game, gameIssues ]}
    {#each gameIssues as issue (issue._id)}
        <GameIssue on:delete={deleteIssue} {issue} />
    {/each}
{/each}