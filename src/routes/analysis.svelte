<script lang="ts">
	import AddButton from '$lib/AddButton.svelte'
	import { SetMap } from '$lib/ADTs/SetMap'
	import Controller from '$lib/Controller.svelte'
	import EllipsisMenu from '$lib/EllipsisMenu.svelte'
	import HiddenSelectableInput from '$lib/HiddenSelectableInput.svelte'
	import { selectedGroup, groups, weekNames, exercises, workoutPrograms } from '$lib/Model'
	import AppTemplate from '$lib/AppTemplate.svelte'
	import TableTemplate from '$lib/TableTemplate.svelte'

	let controller: Controller
	/*
		TEST: clicking tabs changes selected tab
	 */

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

<Controller bind:this={controller} />

<AppTemplate
	content={{
		title: 'Set Analysis',
		redirectPlaceholder: 'Set Planner',
		redirectRef: '/',
		tabNames: [...$groups.keys()],
		selectedTab: $selectedGroup,
		onTabSelection: (tabName) => {
			$selectedGroup = tabName
		},
		heightTransitionMultiplier: $selectedGroup
			? $groups.getDefined($selectedGroup).size + 1
			: 1,
	}}
>
	<svelte:fragment slot="navTabContent" let:tabName={groupName}>
		<EllipsisMenu
			dynamicWidth
			inputPlaceholderText="Updated group name"
			on:update={(event) => controller.updateGroup(groupName, event.detail)}
			on:delete={() => controller.deleteGroup(groupName)}
		>
			<div class="py-5" slot="placeholderContent">
				{groupName}
			</div>
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

	<svelte:fragment slot="main-section">
		{#if $selectedGroup == null}
			<p>Begin by adding a new group!</p>
		{:else}
			<TableTemplate>
				<svelte:fragment slot="headerColumnOne">Tag</svelte:fragment>
				<svelte:fragment slot="body">
					{#each [...tagSets.entries()] as [tagName, sets]}
						<!-- Tag name -->
						<div class="col-start-1">
							<!-- BUG: ignore $selectedGroup being null warning, component within if-clause that checks for this  -->
							<EllipsisMenu
								dynamicWidth
								inputPlaceholderText="Updated tag name"
								on:update={(event) =>
									controller.updateTag($selectedGroup, tagName, event.detail)}
								on:delete={() => controller.deleteTag(tagName)}
							>
								<!-- Possible move this restrictiong to be set in TableTemplate, currently just duplicate code -->
								<div slot="placeholderContent" class="max-w-[22rem] max-w truncate">
									{tagName}
								</div>
							</EllipsisMenu>
						</div>
						{#each sets as setCount}
							<!-- Same height as SetNumberInput, simplifies row heights -->
							<!-- (Using grid-auto-rows:minmax(2.5rem, max-content) creates a tricky situation with the <hr/>) -->
							<div class="justify-self-center grid place-content-center h-10">
								{setCount}
							</div>
						{/each}
					{/each}
					<!-- Add exercise plan to workout day -->
					<div class="col-start-1 pl-3 mt-2">
						<HiddenSelectableInput
							placeholderText="New tag name"
							on:selected={(event) => controller.createTag(event.detail)}
						>
							<AddButton slot="placeholderContent" />
						</HiddenSelectableInput>
					</div>
				</svelte:fragment>
			</TableTemplate>
		{/if}
	</svelte:fragment>
</AppTemplate>
