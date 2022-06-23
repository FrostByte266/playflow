<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    const keypadNums = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['back', 0, 'submit']
    ]

    export let enteredPin = ''
    export let pinView = ''

    $: pinView = enteredPin.replace(/\d(?!$)/g, '•')
    const dispatcher = createEventDispatcher()

    function pinKeyPressed(key: string | number) {
        if (key === 'back') {
            enteredPin = enteredPin.slice(0, -1)
        } else if (key === 'submit') {
            dispatcher('submit')
        } else {
            enteredPin += key
        }
    }
</script>

<div class="grid grid-rows-4 grid-cols-3 gap-5">
    {#each keypadNums as row}
        {#each row as i}
            <button on:click={() => pinKeyPressed(i)} class="text-center p-2 bg-gray-400 hover:bg-gray-500">{i}</button>
        {/each}
    {/each}

</div>