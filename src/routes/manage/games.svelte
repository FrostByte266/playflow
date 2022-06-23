<script lang="ts">
    import { games } from '$lib/stores/seedData'
    import { session } from '$app/stores'
    import EditableGame from '$lib/components/EditableGame.svelte'
    import NewGame from '$lib/components/NewGame.svelte'
    import EmployeeInfo from '$lib/components/EmployeeInfo.svelte'

    function addNew(e: CustomEvent) {
        games.update(games => [e.detail, ...games])
    }
</script>
<svelte:head>
    <title>Manage Games</title>
</svelte:head>

<div class="flex justify-between items-center">
    <h1 class="text-3xl text-center pl-5 select-none cursor-default">Managing Games</h1>
    <div class="p-5">
        <EmployeeInfo employee={$session.user} />
    </div>
</div>

<div class="grid-cols-3 auto-rows-auto items-center justify-center">
    <NewGame on:created={addNew} />
    {#each $games as game (game.name)}
        <EditableGame {game} />
    {/each}
</div>