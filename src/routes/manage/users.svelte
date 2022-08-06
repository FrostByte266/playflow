<script lang="ts" context="module">
    import apiRoute, { defaultFetchProps } from '$lib/utils/apiRoute'
    import type { Load } from './__types/users'

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

    import { session } from '$app/stores'
    import EditableEmployee from '$lib/components/EditableEmployee.svelte'
    import NewEmployee from '$lib/components/NewEmployee.svelte'
    import EmployeeInfo from '$lib/components/EmployeeInfo.svelte'

    import type { IEmployee } from '$lib/types/employee'

    export let employees: Array<IEmployee>
    console.log(employees)

    async function addNew(e: CustomEvent<IEmployee>) {
        console.log(JSON.stringify(e.detail))
        const res = await fetch(apiRoute('/employees'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(e.detail),
            ...defaultFetchProps
        })
        const data: IEmployee = await res.json()

        const { name, id, role } = data
        employees = [{ name, id, role }, ...employees]
    }
</script>
<svelte:head>
    <title>Manage Users</title>
</svelte:head>

<div class="flex justify-between items-center">
    <h1 class="text-3xl text-center pl-5 select-none cursor-default">Managing Users</h1>
    <div class="p-5">
        <!-- <EmployeeInfo employee={$session.user} /> -->
    </div>
</div>

<div class="grid-cols-3 auto-rows-auto items-center justify-center">
    <NewEmployee on:created={addNew} />
    {#each employees as employee (employee.id)}
        <!-- <EditableEmployee {employee} /> -->
        {JSON.stringify(employee)}
    {/each}
</div>