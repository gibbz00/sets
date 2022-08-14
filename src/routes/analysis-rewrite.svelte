<script lang="ts">
	import { SetMap } from '$lib/ADTs/SetMap'

	import { selectedGroup, groups, weekNames, exercises, workoutPrograms } from '$lib/Model'
	/*
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
		if ($selectedGroup != null) {
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
										(setCount, weekIndex) =>
											setCount + exercisePlan.sets[weekIndex]
									)
							)
						}
					}
				}
			}
		}
		return tempTagSets
	})()
</script>

<svelte:fragment slot="title">Set analyis</svelte:fragment>
<!-- TODO: supply redirect href -->
<svelte:fragment slot="redirectPlaceholder">Set planner</svelte:fragment>

<!-- TODO supply arrray to iterate: [...$groups.keys()], and on click funciton: () =>  $selectedGroup = groupName  -->
<svelte:fragment slot="navTabContent">
	<EllipsisMenu
		dynamicWidth
		inputPlaceholderText="Updated group name"
		on:update={(event) => controller.updateGroup(groupName, event.detail)}
		on:delete={() => controller.deleteGroup(groupName)}
	>
		<!-- Supplied tabname by slotprop -->
		{tabName}
	</EllipsisMenu>
</svelte:fragment>
<span slot="navOptionalContent" class="px-4 w-min my-auto justify-self-center">
	<HiddenSelectableInput
		placeholderText="New group name"
		on:selected={(event) => controller.createGroup(event.detail)}
	>
		<AddButton slot="placeholderContent" />
	</HiddenSelectableInput>
</span>

<!-- TODO: supply maxHeight funciton: {$selectedGroup ? ($groups.getDefined($selectedGroup).size + 1) * 110 : 110} -->
