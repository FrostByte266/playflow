<script lang="ts" context="module">
    import type { Load } from './__types/login'
    export const load: Load = async ({ fetch }) => {
        const res = await fetch('/api/employees')
        return {
            props: {
                employees: await res.json()
            }
        }
    }
</script>

<script lang="ts">
    import EmployeeInfo from '$lib/components/EmployeeInfo.svelte'
    import PinEntry from '$lib/components/PinEntry.svelte'


    import { goto } from '$app/navigation'
    import apiRoute from '$lib/utils/apiRoute'

    import type { IEmployee } from '$lib/types/employee'
    import type { Optional } from '$lib/types/utility'
    const storeNumber = 795
    export let employees: Array<IEmployee>;

    function reset() {
        selectedUser = undefined
        enteredPin = undefined
    }

    async function logIn() {
        // We can use type assertions here because
        // the component that calls this function is only
        // rendered if there is a user selected
        const res = await fetch(apiRoute('/auth/login'), {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ID: selectedUser!.ID,
                pin: enteredPin
            })
        })

        if(res.ok) {
            goto('/')
        } else {
            message = 'Invalid PIN!'
        }


    }

    let selectedUser: Optional<IEmployee>;
    let enteredPin: Optional<string>
    let pinView: string
    let message = ''
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="bg-gray-300 h-screen ">
    <div class="h-full flex flex-col items-center justify-center">
        <div class="p-5 flex flex-col align-center items-center bg-gray-400 rounded-lg">
            {#if selectedUser}
                <h1 class="text-3xl">{selectedUser.name}, please enter your PIN</h1>
                <EmployeeInfo employee={selectedUser} />
                <h1 class="text-red-500">{message}</h1>
                <PinEntry on:submit={logIn} bind:enteredPin bind:pinView />
                {#if enteredPin}
                    <h1>{pinView}</h1>
                {:else}
                    <h1 class="text-gray-300">Enter your pin</h1>
                {/if}
                <button on:click={reset}>Return to user select</button>
            {:else}
                <h1 class="text-3xl">Welcome #{storeNumber}. Please select a user</h1>
                <div class="w-full p-5 gap-5 flex justify-around items-center">
                    {#each employees as employee (employee.ID)}
                        <div class="transition-transform hover:scale-125">
                            <EmployeeInfo on:click={() => selectedUser=employee} {employee} />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>