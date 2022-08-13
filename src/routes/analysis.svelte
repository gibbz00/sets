<!-- TODO: this route shows many similarities with index, see how it can be modularied -->
<script lang="ts">
	import { groups, weekNames, selectedGroup, workoutPrograms, exercises } from '$lib/Model'
	import Controller from '$lib/Controller.svelte'
	import Icon from '$lib/Icon.svelte'
	import EllipsisMenu from '$lib/EllipsisMenu.svelte'
	import HiddenSelectableInput from '$lib/HiddenSelectableInput.svelte'

	import { crossfade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import AddButton from '$lib/AddButton.svelte'
	import HeightTransition from '$lib/HeightTransition.svelte'
	import TableTemplate from '$lib/TableTemplate.svelte'
	import { SetMap } from '$lib/ADTs/SetMap'

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

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set analysis</h1>
	<a
		class="
			flex 
			items-center 
			justify-around 
			px-4 
			py-3 
			bg-green-800 
			hover:bg-green-900 
			rounded-sm
		"
		href="/"
	>
		<span
			class="
				text-2xl
				text-white
				font-medium
				h-min
			"
		>
			Set planner
		</span>
		<div class="ml-2">
			<Icon class="fill-white" type="arrowRightAlt" />
		</div>
	</a>
</header>

<main class="shadow-md pb-5 rounded-md">
	<!-- Group tabs -->
	<!-- h-[4.8rem as fallback height for the case when all tabs risk being removed] -->
	<nav
		class="
			flex 
			text-2xl 
			text-center 
			rounded-md 
			bg-slate-50
			h-[4.8rem]
		"
	>
		{#each [...$groups.keys()] as groupName (groupName)}
			<div
				class="flex flex-col items-center justify-center w-full hover:bg-slate-100"
				on:click|capture={() => {
					$selectedGroup = groupName
				}}
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
						in:receive={{ key: groupName }}
						out:send={{ key: groupName }}
						class="h-1 w-full bg-green-900"
					/>
				{/if}
			</div>
		{/each}
		<span class="px-4 w-min my-auto justify-self-center">
			<HiddenSelectableInput
				placeholderText="New group name"
				on:selected={(event) => controller.createGroup(event.detail)}
			>
				<AddButton slot="placeholderContent" />
			</HiddenSelectableInput>
		</span>
	</nav>
	<!-- Table container with add week button -->
	<HeightTransition
		maxHeight={$selectedGroup ? ($groups.getDefined($selectedGroup).size + 1) * 110 : 110}
	>
		<section class="mx-4 mt-5">
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
									<div
										slot="placeholderContent"
										class="max-w-[22rem] max-w truncate"
									>
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
		</section>
	</HeightTransition>
</main>
