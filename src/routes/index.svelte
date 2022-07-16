<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script lang="ts">
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte"
    import WeekNames from "$lib/WeekNames.svelte"
    import { weekNames, groups, workoutPrograms, exercises, selectedDay, refresh } from "$lib/Stores"
    import type { ExercisePlan, ExerciseProperties } from "$lib/utils/Types"
    import { ThrowSet } from "$lib/utils/ThowSet"
    import ClickableTooltip from "$lib/ClickableTooltip.svelte"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";

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
        {#each $workoutPrograms.getDefined($selectedDay) as exercisePlan}
            <ClickableTooltip>
                <span slot="shown">{exercisePlan.exerciseName}</span>
                <div slot="content">
                    <!-- group names -->
                    {#each Array.from($groups.keys()) as groupName}
                        <div>{groupName}:
                        {#if $exercises.getDefined(exercisePlan.exerciseName).has(groupName) }
                            {#each Array.from($exercises.getDefined(exercisePlan.exerciseName).getDefined(groupName)) as tag }
                                <span>{tag}</span>
                            {/each}
                        {/if}
                        {#key $refresh}
                            <HiddenAutoCompleteSelector placeholder="Add tag" on:selected={(event) => model.addExerciseTag(event.detail, groupName, exercisePlan.exerciseName)}/>
                        {/key}
                        </div>
                    {/each}
                    Add group
                    <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}/>
                </div>
            </ClickableTooltip>

            <!-- sets -->
            {#each exercisePlan.sets as set}
                <div class="sets">
                    <input type="number" bind:value={set}>
                </div>
            {/each}
        {/each}

        <AddButton scenario="exercise"/>
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
