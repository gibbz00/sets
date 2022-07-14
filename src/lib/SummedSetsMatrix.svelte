<script lang="ts">
    import { weekNames, workoutPrograms, groups, exercises } from "$lib/SeededStores"
    import { SetMap } from "$lib/utils/SetMap";
    export let selectedGroup: string = $groups.keys().next().value

    /* sumSetsByTag:
        Preparation:
            new reactive datastructure:
            SetMap with tag names as key and set numbers as value
            let tagSets: SetMap<string, number[]>  = new SetMap()
            for each tag in group
                tagSets.add(tagName, new Array($weekNames.size).fill(0))
        
        Algorithm:
            for each weekDay in weekDays
                for each exercise in exercisesPlans
                    for each tag in correct group
                        add the sets of exercise plan to sets of tag
    */
    //Improvement: be a bit smarter in when to recalculate tagsSets
    $: tagSets = (() => {
        let tempTagSets: SetMap<string, number[]>  = new SetMap()
        for (let tagName of $groups.getDefined(selectedGroup).values()) {
            tempTagSets.set(tagName, new Array($weekNames.size).fill(0))
        }
        for (let exercisesPlans of $workoutPrograms.values()) {
            for (let exercisePlan of exercisesPlans) {
                let exerciseGroups = $exercises.getDefined(exercisePlan.exerciseName)
                if (exerciseGroups.has(selectedGroup)) {
                    for (let exerciseTag of exerciseGroups.getDefined(selectedGroup)) {
                        tempTagSets.update(exerciseTag, tempTagSets.getDefined(exerciseTag).map((setCount, weekIndex) => setCount + exercisePlan.sets[weekIndex]))
                    }
                }
            }
        }
        return tempTagSets
    })()
</script>

{#each Array.from(tagSets.entries()) as tagSet}
    <!-- Tag name -->
    <div>{tagSet[0]}</div>
    {#each tagSet[1] as setCount}
        <div>{setCount}</div>        
    {/each} 
{/each}
