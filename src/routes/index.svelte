<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script lang="ts">
    import { weekNames, groups, workoutProgram } from "$lib/SeededStores"
    import { SetMap } from "$lib/utils/SetMap";
    import type { ExercisePlan } from "$lib/utils/Types";

    // Automatically pick first day from workout program
    let selectedDay: string = $workoutProgram.keys().next().value
    // Should not be able to be undefined given the current program logic, fingers crossed
    $: selectedExercisePlans = $workoutProgram.get(selectedDay) as ExercisePlan[]

    // create a key-value map where the key is the name of the group and the value is column line start without offset
    let groupColumnStart = new SetMap<string, number>()
    groups.subscribe(value => {
        let keys = Array.from(value.keys())
        for (let index = 0; index < value.size; index++) {
            groupColumnStart.set(keys[index], index)
        }

    })

</script>

<select bind:value={selectedDay}>
    {#each Array.from($workoutProgram.keys()) as weekday}
        <option value={weekday}>{weekday}</option>
    {/each}
</select>

<a href="/analysis">Set analysis</a>

<hr>

<div class="grid" style:--group-columns={$groups.size}>
    <div class="weeks">
        {#each Array.from($weekNames.values()) as weekName}
            {weekName}
        {/each}
    </div>

    <!-- group names -->
    {#each Array.from($groups.keys()) as groupName}
        <div>{groupName}</div>
    {/each}

    <!-- Render exercise names, their sets, and their tags for the selected day -->
    <!-- iterates over ExercisePlan[] -->
    {#each selectedExercisePlans as exercisePlan}
        <div class="exercise-names">
            {exercisePlan.exercise[0]}
        </div>

        <!-- sets -->
        <div class="sets">
            {#each exercisePlan.sets as set}
                {set}
            {/each}
        </div>

        <!-- groups -->
        {#each exercisePlan.exercise[1] as groupReference}
            <!-- place inside right column -->
            <div style:grid-column-start={3+groupColumnStart.getEntry(groupReference.group[0])[1]}>
                <!-- loop over each tag and decorate with right color name -->
                {#each Array.from(groupReference.tags.values()) as tag }
                    <span>{tag}</span>
                {/each}
            </div>
        {/each}
   {/each}

</div>


<style>
    .grid {
        display: grid;
        grid-template-columns: calc(2 + var(--group-columns));
        grid-template-columns: repeat(calc(2 + var(--group-columns)), 1fr);
        grid-auto-rows: 50px;
    }

    .weeks {
        grid-column-start: 2;
    }

    /* TODO: required if the tags are loaded dynamically?  */
    .exercise-names {
        grid-column-start: 1;
    }
</style>

<!-- <AutoComplete data={exerciseList.exercises.map(exercise => exercise.name)} placeholder="Add exercise"/> -->