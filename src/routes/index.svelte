<script lang="ts">
    import WeekNames from "$lib/WeekNames.svelte"
    import { weekNames, groups, workoutPrograms, exercises, selectedDay } from "$lib/Stores"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte";
    import EditableTags from "$lib/EditableTags.svelte"

    let model: Model

</script>

<Model bind:this={model} />

<nav class="flex text-2xl text-center">
    {#each Array.from($workoutPrograms.keys()) as weekday}
        <div class="w-full" style:border-bottom-width={$selectedDay == weekday ? "4px" : ""} on:click={() => {$selectedDay = weekday}}>{weekday}</div>
    {/each}
    <a class="w-full" href="/analysis">Set analysis</a>
</nav>

<hr>

<main class="flex">
        <!-- "HACK": dynamically assigned tailwind classes don't really work since unused are removed with postcss be the svelte preprocessor -->
        <div 
            class="grid w-full text-center"
            style:grid-template-columns={"repeat(" + (1 + $weekNames.size) + ", minmax(0, 1fr))"}
        >
            <div class="contents text-xl">
                <div class="text-left">Exercise</div>
                <WeekNames/>
            </div>

            <!-- iterates over ExercisePlan[] -->
            {#each $workoutPrograms.getDefined($selectedDay) as {exerciseName, sets}, index}
                <!-- scoping groups with tailwind-scoped-groups package -->
                <div class="col-start-1 text-left relative group-one">
                    {exerciseName}
                    <div class="w-max p-3 hidden bg-slate-300 absolute top-0 left-full z-10 group-one-hover:inline">
                        <!-- group names -->
                        {#each Array.from($groups.keys()) as groupName}
                            <div class="text-lg font-bold">{groupName}:</div>
                            <div class="flex">
                                {#if $exercises.getDefined(exerciseName).has(groupName) }
                                    <EditableTags {exerciseName} {groupName} />
                                {/if}
                                <HiddenAutoCompleteSelector 
                                    data={Array.from($groups.getDefined((groupName)).values())} 
                                    placeholder="Add tag" on:selected={(event) => model.createExerciseTag(event.detail, groupName, exerciseName)}
                                >
                                <span class="h-full font-bold text-2xl" slot="placeholder">
                                    +
                                </span>
                                </HiddenAutoCompleteSelector>
                            </div>
                        {/each}
                        <div 
                            class="
                                flex 
                                flex-col 
                                [&_button]:bg-blue-800 
                                [&_button]:p-2
                                space-y-1
                            "
                        >
                            <!-- Add group button -->
                            <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}>
                                <button class="w-full" slot="placeholder">Add group</button>
                            </HiddenAutoCompleteSelector>

                            <!-- Change exercise -->
                            <HiddenAutoCompleteSelector 
                                placeholder="New exercise name" 
                                data={Array.from($exercises.keys())} 
                                on:selected={(event) => model.updatePlanExercise(event.detail, index)}
                            > 
                                <button class="w-full" slot="placeholder">Change exercise</button>
                            </HiddenAutoCompleteSelector>

                            <!-- Delete exercise -->
                            <button on:click={() => model.deleteExercisePlan($selectedDay, exerciseName, index)}>
                                Delete exercise plan
                            </button>

                        </div>
                    </div>
                </div>

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