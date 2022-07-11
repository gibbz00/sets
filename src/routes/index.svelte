<svelte:head>
    <!-- HACK -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/themes/light.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/shoelace.js"></script>
</svelte:head>

<script>
    import AutoComplete from "$lib/AutoComplete.svelte"
import { GroupList, groupsSeed } from "$lib/GroupList"
    import { Program } from "$lib/Program"

    let program = new Program()
    let selectedDay = 0
</script>

<select bind:value={selectedDay}>
    {#each program.workoutDays as day, index}
        <option value={index}>{day.name}</option>
    {/each}
</select>

<hr>

<div class="grid" style:--group-columns={program.groupList.groups.length}>
    <!-- group names -->
    {#each program.groupList.groups as group}
        <div class=group-name>{group.name}</div>
    {/each}

    <!-- Render exercise names, their sets, and their tags for the selected day -->
    {#each program.workoutDays[selectedDay].exercisePlans as exercisePlan}
        <!-- names -->
        <div class="exercise-names">
            {exercisePlan.exercise.name}
        </div>

        <!-- sets -->
        <div class="sets">
            {#each exercisePlan.sets as set, index}
                {set}
            {/each}
        </div>
   {/each}

</div>


<style>
    .grid {
        display: grid;
        /* grid-template-columns: calc(2 + var(--group-columns)); */
        grid-template-columns: repeat(calc(2 + var(--group-columns)), 1fr);
        grid-auto-rows: 50px;
    }

    .group-name:first-child {
        grid-column-start: 3;
    }

    /* TODO: should not be required one the tags loaded dynamically  */
    .exercise-names {
        grid-column-start: 1;
    }
</style>

<!-- <AutoComplete data={exerciseList.exercises.map(exercise => exercise.name)} placeholder="Add exercise"/> -->