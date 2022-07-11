<svelte:head>
    <!-- HACK -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/themes/light.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/shoelace.js"></script>
</svelte:head>

<script>
    import AutoComplete from "$lib/AutoComplete.svelte"
    import {program, exercises} from "$lib/Data"

    let selectedDay = 0
</script>

<select bind:value={selectedDay}>
    {#each program as day, index}
        <option value={index}>{day.name}</option>
    {/each}
</select>

{#each program[selectedDay].exercisePlans as exercisePlan}
    <p>{exercisePlan.name}</p>
    {#each exercisePlan.sets as set}
        {set}
    {/each}
{/each}

<AutoComplete data={exercises.map(exercise => exercise.name)} placeholder="Add exercise"/>