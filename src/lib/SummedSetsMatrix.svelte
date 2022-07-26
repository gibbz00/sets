<script lang="ts">
	import {
		weekNames,
		workoutPrograms,
		groups,
		exercises,
		selectedGroup,
	} from '$lib/Stores'
	import { SetMap } from '$lib/ADTs/SetMap'
	import Model from '$lib/Model.svelte'
	import PenBinHover from './PenBinHover.svelte'

	let model: Model

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
		if ($selectedGroup != null) {
			let tempTagSets: SetMap<string, number[]> = new SetMap()
			for (let tagName of $groups.getDefined($selectedGroup).values()) {
				tempTagSets.set(tagName, new Array($weekNames.size).fill(0))
			}
			for (let exercisesPlans of $workoutPrograms.values()) {
				for (let exercisePlan of exercisesPlans) {
					let exerciseGroups = $exercises.getDefined(
						exercisePlan.exerciseName
					)
					if (exerciseGroups.has($selectedGroup)) {
						for (let exerciseTag of exerciseGroups.getDefined(
							$selectedGroup
						)) {
							tempTagSets.update(
								exerciseTag,
								tempTagSets
									.getDefined(exerciseTag)
									.map(
										(setCount, weekIndex) =>
											setCount +
											exercisePlan.sets[weekIndex]
									)
							)
						}
					}
				}
			}
			return tempTagSets
		}
	})()

	// Currently only used in HoverChange on:update,
	// which is nested an if statement that checks if tagSets is undefined,
	// which is only possible if $selected group is undefined
	// Hence it can not be null, but svelte doesn't support this reassurence with the ! notation
	// Don't use the variable outside if tagSets
	$: notNullSelectedGroup = $selectedGroup!
</script>

<Model bind:this={model} />

{#if tagSets != undefined}
	{#each [...tagSets.entries()] as [tagName, sets]}
		<!-- Tag name -->
		<div
			class="inline-block px-2 py-1 text-white bg-blue-800 rounded-full w-max font-semi"
		>
			<PenBinHover
				svgClass="fill-white"
				updatePlaceholder="New tag name"
				on:update={(event) =>
					model.updateTag(
						notNullSelectedGroup,
						tagName,
						event.detail
					)}
				on:delete={() => model.deleteTag(tagName)}
			>
				<span slot="placeholder" class="w-max">{tagName}</span>
			</PenBinHover>
		</div>
		{#each sets as setCount}
			<div>{setCount}</div>
		{/each}
	{/each}
{/if}
