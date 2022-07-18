<script lang="ts">
    
    import EmployeeInfo from '$lib/components/EmployeeInfo.svelte'

    import apiRoute, { defaultFetchProps } from '$lib/utils/apiRoute'

    import { session } from '$app/stores'
    import { goto } from '$app/navigation'

    async function startTap(e: MouseEvent) {
        e.preventDefault()
        const res = await fetch(apiRoute('/tap'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: new Date(),
                time: "AM",
                performedBy: $session.user.id,
            }),
            ...defaultFetchProps
        })
        const data = await res.json()

        goto(`/gametap/${data.tap._id}/${data.firstGame._id}`)
    }

</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<div class="flex justify-between items-center">
    <h1 class="text-3xl text-center pl-5 select-none cursor-default">▶️ PlayFlow 🌊</h1>
    <div class="p-5">
        <EmployeeInfo employee={$session.user} />
    </div>
</div>

<div class="bg-gray-300 m-10 p-5">
    <h1 class="text-2xl">Daily Card Tap</h1>
    <a class="bg-gray-500 p-10 text-white text-xl inline-block" href="_blank" on:click={startTap}>Enter Flow</a>
    <a class="bg-gray-500 p-10 text-white text-xl inline-block" href="/issues">Review Pending Issues</a>
</div>
<!-- <div class="bg-gray-300 m-10 p-5">
    <h1 class="text-2xl">Management</h1>
    <a class="bg-gray-500 p-10 text-white text-xl inline-block" href="/manage/games">Manage Games</a>
    <a class="bg-gray-500 p-10 text-white text-xl inline-block" href="/manage/users">Manage Users</a>
</div> -->