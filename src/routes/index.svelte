<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script lang="ts">
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte";
    import WeekNames from "$lib/WeekNames.svelte"; 
    import { weekNames, groups, workoutPrograms, exercises, selectedDay } from "$lib/Stores"
    import { SetMap } from "$lib/utils/SetMap"
    import type { ExercisePlan, ExerciseProperties } from "$lib/utils/Types"
    import { ThrowSet } from "$lib/utils/ThowSet";
    import ClickableTooltip from "$lib/ClickableTooltip.svelte";
    import Modal from "$lib/Modal.svelte";

    let hideAutoCompleteSelectorsKeyRefreshor = new Object()
    let modal: Modal;

    // Should not be able to be undefined given the current program logic, fingers crossed
    $: selectedExercisePlans = $workoutPrograms.get($selectedDay) as ExercisePlan[]

    function createExercisePlan(desiredName: string){
        if(desiredName != "") {
            if (!$exercises.has(desiredName)) {
                $exercises.set(desiredName, new SetMap())
            }
            const newExercisePlan: ExercisePlan = {
                exerciseName: desiredName,
                sets: new Array($weekNames.size).fill(0)
            }
            workoutPrograms.update(setmap => { 
                setmap.get($selectedDay)!.push(newExercisePlan)
                return setmap
            })
        }
        reset()
    }

    //TODO:
    function addExerciseTag(desiredName :string, groupName: string, exerciseName: string) {
        if(desiredName != "") {
            // Check that tag is not present exercise property 
            if($exercises.get(exerciseName)?.get(groupName)?.has(desiredName)){
                // BUG: Inputs that are only shown during hover are not disabled. 
                modal.show(`The tag ${desiredName} already exists in ${groupName}!`)
                return
            }

            // Check that tag does not aleady exists in group. If so; add it to the groups registry
            if (!$groups.get(groupName)?.has(desiredName)) {
                $groups.get(groupName)?.add(desiredName)
            }

            // Link tag to exercise
            exercises.update(setmap => {
                let exerciseProperties = setmap.get(exerciseName)
                // check if group exists
                // if not create groupName entry
                if(!exerciseProperties?.has(groupName)) {
                    exerciseProperties?.set(groupName, new ThrowSet())
                }
                exerciseProperties?.get(groupName)?.add(desiredName)
                return setmap.update(exerciseName, exerciseProperties as ExerciseProperties)
            })
        }
        reset()
    }

    function addWeek(weekName: string){
        // Check that week names does not already exist
        if ($weekNames.has(weekName)) {
                modal.show(`${weekName} already exists!`)
        }
        else {
            $weekNames = $weekNames.add(weekName)
            // numbers of sets in exercise plans must also be updated
            for (let workoutProgram of  $workoutPrograms.entries()){
                for (let index = 0; index < workoutProgram[1].length; index++) {
                    workoutProgram[1][index].sets.push(0)
                }
                $workoutPrograms = $workoutPrograms.update(workoutProgram[0], workoutProgram[1])
            }
            reset()
        }
    }

    function reset() {
        hideAutoCompleteSelectorsKeyRefreshor = new Object()
    }

</script>

<!-- Might move to __layout -->
<Modal bind:this={modal} visible={false}/>

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
        {#each selectedExercisePlans as exercisePlan}
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
                        {#key hideAutoCompleteSelectorsKeyRefreshor}
                            <HiddenAutoCompleteSelector placeholder="Add tag" on:selected={(event) => addExerciseTag(event.detail, groupName, exercisePlan.exerciseName)}/>
                        {/key}
                        </div>
                    {/each}
                </div>
            </ClickableTooltip>

            <!-- sets -->
            {#each exercisePlan.sets as set}
                <div class="sets">
                    <input type="number" bind:value={set}>
                </div>
            {/each}
        {/each}

        {#key hideAutoCompleteSelectorsKeyRefreshor}
            <HiddenAutoCompleteSelector placeholder="Add exercise" data={Array.from($exercises.keys())} on:selected={(event) => createExercisePlan(event.detail)}/>
        {/key}
    </div>

    {#key hideAutoCompleteSelectorsKeyRefreshor}
        <HiddenAutoCompleteSelector placeholder="Add week" on:selected={(event) => addWeek(event.detail)}/>
    {/key}
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
