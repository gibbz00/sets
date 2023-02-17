<script lang="ts">
	import AddButton from '$lib/AddButton.svelte'
	import { SetMap } from '$lib/ADTs/SetMap'
	import Controller from '$lib/Controller.svelte'
	import EllipsisMenu from '$lib/EllipsisMenu.svelte'
	import HiddenSelectableInput from '$lib/HiddenSelectableInput.svelte'
	import { selectedGroup, groups, weekNames, exercises, workoutPrograms } from '$lib/Model'
	import AppTemplate from '$lib/AppTemplate.svelte'
	import TableTemplate from '$lib/TableTemplate.svelte'
	import { crossfade, fade } from 'svelte/transition'
	import {
		fadeInDelay,
		fadeInDuration,
		fadeOutDelay,
		fadeOutDuration,
	} from '$lib/transitionConstants'
	import { quintOut } from 'svelte/easing'

	let controller: Controller

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
			for (let exerciseInfo of $workoutPrograms.values()) {
				for (let exercisePlan of exerciseInfo.exercises) {
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

	// Tab transition
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node)
			const transform = style.transform === 'none' ? '' : style.transform

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			}
		},
	})
</script>

<Controller bind:this={controller} />

<AppTemplate
	content={{
		redirectPlaceholder: 'Set Planner',
		redirectRef: '/planning',
		heightTransitionMultiplier: $selectedGroup
			? $groups.getDefined($selectedGroup).size + 1
			: 1,
	}}
>
	<svelte:fragment slot="header">
		<h1 class="text-6xl">Set Analysis</h1>
	</svelte:fragment>

	<svelte:fragment slot="nav">
		<!-- Tabs -->
		<!-- h-[4.8rem as fallback height for the case when all tabs risk being removed] -->
		<nav
			class="
				flex 
				text-2xl 
				text-center 
				bg-slate-50
				h-[4.8rem]
				rounded-t-md
			"
		>
			{#each [...$groups.keys()] as groupName (groupName)}
				<div
					class="
						grid
						place-content-center
						w-full 
						hover:bg-slate-100
						relative
					"
					on:click|capture={() => ($selectedGroup = groupName)}
				>
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
					{#if $selectedGroup == groupName}
						<div
							in:receive|local={{ key: groupName }}
							out:send|local={{ key: groupName }}
							class="absolute bottom-0 inset-x-0 h-1 w-full bg-green-900"
						/>
					{/if}
				</div>
			{/each}
			<span class="px-4 w-min my-auto justify-self-center">
				<HiddenSelectableInput
					placeholderText="New group name"
					on:selected={(event) => controller.createGroup(event.detail.selected)}
				>
					<AddButton slot="placeholderContent" />
				</HiddenSelectableInput>
			</span>
		</nav>
	</svelte:fragment>
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
								fadeTransition
								dynamicWidth
								inputPlaceholderText="Updated tag name"
								on:update={(event) =>
									controller.updateTag($selectedGroup, tagName, event.detail)}
								on:delete={() => controller.deleteTag(tagName)}
							>
								<!-- Possible move this restrictiong to be set in TableTemplate, currently just duplicate code -->
								<div
									slot="placeholderContent"
									class="max-w-[22rem] max-w truncate pl-3"
								>
									{tagName}
								</div>
							</EllipsisMenu>
						</div>
						{#each sets as setCount}
							<!-- Same height as SetNumberInput, simplifies row heights -->
							<!-- (Using grid-auto-rows:minmax(2.5rem, max-content) creates a tricky situation with the <hr/>) -->
							<div
								class="justify-self-center grid place-content-center h-10"
								in:fade|local={{
									delay: fadeInDelay,
									duration: fadeInDuration,
								}}
								out:fade|local={{
									delay: fadeOutDelay,
									duration: fadeOutDuration,
								}}
							>
								{setCount}
							</div>
						{/each}
					{/each}
				</svelte:fragment>
				<div slot="footer" class="col-start-1 pl-3 mt-2">
					<HiddenSelectableInput
						placeholderText="New tag name"
						on:selected={(event) => controller.createTag(event.detail.selected)}
					>
						<AddButton slot="placeholderContent" />
					</HiddenSelectableInput>
				</div>
			</TableTemplate>
		{/if}
	</svelte:fragment>
</AppTemplate>
