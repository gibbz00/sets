<script lang="ts">
	import { weekNames, workoutPrograms, selectedDay, exercises } from '$lib/Model'
	import Controller from '$lib/Controller.svelte'
	import Exercise from '$lib/Exercise.svelte'
	import EllipsisMenu from '$lib/testSnippets/EllipsisMenu.svelte'
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import AddButton from '$lib/testSnippets/AddButton.svelte'
	import Icon from '$lib/Icon.svelte'

	import { crossfade, fade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	import { autocompleteFilter } from '$lib/testSnippets/autoCompleteFilter'
	import HeightTransition from '$lib/HeightTransition.svelte'
	import SetNumberInput from '$lib/SetNumberInput.svelte'

	let controller: Controller

	// Animation setup for chosen tab indicator
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node) {
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

	// TODO: move to HeightTransition?
	const fadeInDelay: number = 100
	const fadeInDuration: number = 100
	const fadeOutDelay: number = 0
	const fadeOutDuration: number = 100
</script>

<Controller bind:this={controller} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set planner</h1>
	<a
		class="flex items-center justify-around px-4 py-3 bg-green-800 hover:bg-green-900 rounded-lg"
		href="/analysis"
	>
		<span class="text-2xl font-medium text-white h-min">Set analysis</span>
		<span class="w-8 h-8">
			<Icon class="fill-white" type="arrowRightAlt" />
		</span>
	</a>
</header>

<main class="pb-5 rounded-md shadow-md">
	<nav class="flex text-2xl text-center rounded-md bg-slate-50">
		{#each [...$workoutPrograms.keys()] as weekday (weekday)}
			<div
				class="flex flex-col w-full hover:bg-slate-100"
				on:click={() => {
					$selectedDay = weekday
				}}
			>
				<div class="py-5">{weekday}</div>
				{#if $selectedDay == weekday}
					<div
						in:receive={{ key: weekday }}
						out:send={{ key: weekday }}
						class="h-1 bg-green-900"
					/>
				{/if}
			</div>
		{/each}
	</nav>

	<!-- Table container with add week button -->
	<HeightTransition maxHeight={($workoutPrograms.getDefined($selectedDay).length + 1) * 150}>
		<section class="mx-4 pt-5">
			<!-- Sets table -->

			<div
				class="grid items-center text-xl gap-y-3"
				style:grid-template-columns={`min-content repeat(${$weekNames.size}, 1fr) min-content`}
			>
				<!-- Table header: Exercise title and week names -->
				<div class="contents text-2xl">
					<div class="max-w-min">Exercise</div>
					{#each [...$weekNames.values()] as weekName, index}
						<div class="justify-self-center">
							<EllipsisMenu
								dynamicWidth
								inputPlaceholderText="New week name"
								on:update={(event) => controller.updateWeek(weekName, event.detail)}
								on:delete={() => controller.deleteWeek(weekName, index)}
							>
								<svelte:fragment slot="placeholderContent">
									{weekName}
								</svelte:fragment>
							</EllipsisMenu>
						</div>
					{/each}
					<!-- Add week button -->
					<div class="justify-self-end">
						<HiddenSelectableInput
							dynamicWidth
							placeholderText="Add week"
							on:selected={(event) => console.log('selected: ', event.detail)}
						>
							<AddButton slot="placeholderContent" />
						</HiddenSelectableInput>
					</div>
				</div>

				<!-- Header separator -->
				<hr class="row-start-2 col-span-full" />

				<!-- table rows -->
				{#each $workoutPrograms.getDefined($selectedDay) as { exerciseName, sets }, index}
					<div
						class="contents"
						in:fade={{
							delay: fadeInDelay,
							duration: fadeInDuration,
						}}
						out:fade={{
							delay: fadeOutDelay,
							duration: fadeOutDuration,
						}}
					>
						<Exercise {exerciseName} {index} />
						<!-- sets grid -->
						<!-- Last sets should self align left due to add for proper add week button placement -->
						{#each sets as set}
							<div class="justify-self-center">
								<SetNumberInput bind:set />
							</div>
						{/each}
					</div>
				{/each}
			</div>

			<!-- Add exercise plan to workout day -->
			<HiddenSelectableInput
				placeholderText="Add exercise plan"
				listItems={[...$exercises.keys()]}
				listFilter={autocompleteFilter}
				on:selected={(event) => controller.createExercisePlan(event.detail)}
			>
				<AddButton slot="placeholderContent" />
			</HiddenSelectableInput>
		</section>
	</HeightTransition>
</main>
