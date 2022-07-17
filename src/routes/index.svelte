<script lang="ts">
    import WeekNames from "$lib/WeekNames.svelte"
    import { weekNames, groups, workoutPrograms, exercises, selectedDay } from "$lib/Stores"
    import ClickableTooltip from "$lib/ClickableTooltip.svelte"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";
    import HoverChange from "$lib/HoverChange.svelte"

    let model: Model

</script>

<Model bind:this={model} />

<nav>
    {#each Array.from($workoutPrograms.keys()) as weekday}
        <span style:text-decoration={$selectedDay == weekday ? "underline" : ""} on:click={() => {$selectedDay = weekday}}>{weekday}</span>
    {/each}
    <a href="/analysis">Set analysis</a>
</nav>

<hr>

<main>
    <div class="grid" style:--numberWeeks={$weekNames.size}>
        <div>Exercise</div>
        <WeekNames/>

        <!-- iterates over ExercisePlan[] -->
        {#each $workoutPrograms.getDefined($selectedDay) as {exerciseName, sets}, index}
            <ClickableTooltip>
                <HoverChange
                    slot="shown"
                    updatePlaceholder="Change exercise"
                    on:delete={() => model.deleteExercisePlan($selectedDay, exerciseName, index)} 
                    on:update={() => console.log("udpate!")}
                >
                    <span>{exerciseName}</span>
                </HoverChange>
                <div slot="content">
                    <!-- group names -->
                    {#each Array.from($groups.keys()) as groupName}
                        <div>{groupName}:
                        {#if $exercises.getDefined(exerciseName).has(groupName) }
                            {#each Array.from($exercises.getDefined(exerciseName).getDefined(groupName)) as tag }
                                <HoverChange updatePlaceholder="Change tag name"
                                    on:delete={() => model.deleteExerciseTag(exerciseName, groupName, tag)} 
                                    on:update={(event) => model.updateTag(groupName, tag, event.detail)}
                                >
                                    <span>{tag}</span>
                                </HoverChange>
                            {/each}
                        {/if}
                        <AddButton scenario="exerciseTag" parameters={{groupName, exerciseName}}/>
                        </div>
                    {/each}
                    Add group
                    <AddButton scenario="group"/>
                </div>
            </ClickableTooltip>

            <!-- sets -->
            {#each sets as set}
                <div class="sets">
                    <input type="number" bind:value={set}>
                </div>
            {/each}
        {/each}

        <AddButton scenario="exercisePlan"/>
    </div>

    <AddButton scenario="week"/>

</main>


<style>
    main {
        display: flex;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }
</style>
