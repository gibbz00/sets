<script lang="ts">
	import { weekNames, workoutPrograms, groups, exercises, selectedGroup } from '$lib/Model'
	import { SetMap } from '$lib/ADTs/SetMap'
	import Controller from '$lib/Controller.svelte'
	import EllipsisMenu from './EllipsisMenu.svelte'

	let controller: Controller

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
	//Improvement: be a bit smarter in when to recalculate tagsSets,
	// the entire matrix is currently being calculated for a small change
	// TODO: make sure that this is exectured if $selectedGroup is null
	$: tagSets = (() => {
		let tempTagSets: SetMap<string, number[]> = new SetMap()
		for (let tagName of $groups.getDefined($selectedGroup).values()) {
			tempTagSets.set(tagName, new Array($weekNames.size).fill(0))
		}
		for (let exercisesPlans of $workoutPrograms.values()) {
			for (let exercisePlan of exercisesPlans) {
				let exerciseGroups = $exercises.getDefined(exercisePlan.exerciseName)
				if (exerciseGroups.has($selectedGroup)) {
					for (let exerciseTag of exerciseGroups.getDefined($selectedGroup)) {
						tempTagSets.update(
							exerciseTag,
							tempTagSets
								.getDefined(exerciseTag)
								.map(
									(setCount, weekIndex) => setCount + exercisePlan.sets[weekIndex]
								)
						)
					}
				}
			}
		}
		return tempTagSets
	})()
</script>

<Controller bind:this={controller} />
