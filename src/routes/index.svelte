<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script lang="ts">
    import AutoCompleteSelector from "$lib/AutoCompleteSelector.svelte"
    import Toggle from "$lib/Toggle.svelte";
    import { weekNames, groups, workoutProgram, exercises } from "$lib/SeededStores"
    import { SetMap } from "$lib/utils/SetMap"
    import type { ExercisePlan, ExerciseProperties } from "$lib/utils/Types"
import { ThrowSet } from "$lib/utils/ThowSet";

    let hideAutoCompleteSelectorsKeyRefreshor = new Object()

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

    function createExercisePlan(desiredName: string){
        if(desiredName != "") {
            if (!$exercises.has(desiredName)) {
                $exercises.set(desiredName, new SetMap())
            }
            const newExercisePlan: ExercisePlan = {
                exerciseName: desiredName,
                sets: new Array($weekNames.size).fill(0)
            }
            workoutProgram.update(setmap => { 
                setmap.get(selectedDay)!.push(newExercisePlan)
                return setmap
            })
        }
        reset()
    }

    //TODO:
    function addExerciseTag(desiredName :string, groupName: string, exerciseName: string) {
        if(desiredName != "") {
            // Check that tag is not a present exercise property 
            if($exercises.get(exerciseName)?.get(groupName)?.has(desiredName)){
                //TODO: proper error handling
                // should show a modal explaining why
                // user should be able to return to properly typing a valid entry
                
                //return in order to skip reset()
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

    function addWeekName( desiredName: string) {
        if(desiredName != "") {

        }
        reset()
    }

    function reset() {
        hideAutoCompleteSelectorsKeyRefreshor = new Object()
    }

    let grid: number[][] = new Array($workoutProgram.get(selectedDay)!.length).fill(new Array(2+$groups.size))
</script>

<select bind:value={selectedDay}>
    {#each Array.from($workoutProgram.keys()) as weekday}
        <option value={weekday}>{weekday}</option>
    {/each}
</select>

<hr>

<div class="grid" style:--group-columns={$groups.size}>
    <div class="weeks">
        {#each Array.from($weekNames.values()) as weekName, index}
            {weekName}
            {#if index + 1 == Array.from($weekNames.values()).length}
                {#key hideAutoCompleteSelectorsKeyRefreshor}
                    <Toggle>
                        <button slot="first">+</button>
                        <AutoCompleteSelector slot="second" placeholder="Add week" on:selected={(event) => addWeekName(event.detail)}/>
                    </Toggle>
                {/key}
            {/if}
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
            {exercisePlan.exerciseName}
        </div>

        <!-- sets -->
        <div class="sets">
            {#each exercisePlan.sets as set}
                {set}
            {/each}
        </div>

        {#each Array.from(groupColumnStart.keys()) as groupName, index}
            <div style:grid-column-start={3+index}>
                <!-- TODO: tag color decoraiton -->
                {#if $exercises.get(exercisePlan.exerciseName).has(groupName) }
                    {#each Array.from($exercises.get(exercisePlan.exerciseName).get(groupName)) as tag }
                        <span>{tag}</span>
                    {/each}
                    
                {/if}

                {#key hideAutoCompleteSelectorsKeyRefreshor}
                    <Toggle>
                        <button slot="first">+</button>
                        <AutoCompleteSelector slot="second" data={Array.from($groups.get(groupName).values())} placeholder="Add tag" on:selected={(event) => addExerciseTag(event.detail, groupName, exercisePlan.exerciseName)}/>
                    </Toggle>
                {/key}
            </div>
        {/each}
   {/each}
</div>

{#key hideAutoCompleteSelectorsKeyRefreshor}
    <Toggle>
        <button slot="first">+</button>
        <AutoCompleteSelector slot="second" data={Array.from($exercises.keys())} placeholder="Add exercise" on:selected={(event) => createExercisePlan(event.detail)}/>
    </Toggle>
{/key}
<!-- <a href="/analysis">Set analysis</a> -->

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
