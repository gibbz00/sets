<script lang="ts">
	import { weekNames, workoutPrograms, selectedDay, exercises } from '$lib/Stores'
	import Model from '$lib/Model.svelte'
	import EllipsisMenu from '$lib/testSnippets/EllipsisMenu.svelte'
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import AddButton from '$lib/testSnippets/AddButton.svelte'
	import Icon from '$lib/Icon.svelte'

	import { crossfade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	import { autocompleteFilter } from '$lib/testSnippets/autoCompleteFilter'
	import HeightTransition from '$lib/HeightTransition.svelte'

	let model: Model

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
</script>

<Model bind:this={model} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set planner</h1>
	<a
		class="flex items-center justify-around px-4 py-3 bg-green-800 hover:bg-green-900 rounded-lg"
		href="/analysis"
	>
		<span class="text-2xl font-medium text-white h-min">Set analysis</span>
		<span class="w-8 h-8">
			<Icon cls="fill-white" type="arrowRightAlt" />
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
	<!-- TODO: change 50 to 160 when exercise plans are being rendered -->
	<HeightTransition maxHeight={($workoutPrograms.getDefined($selectedDay).length + 1) * 50}>
		<section class="mx-4 pt-5">
			<!-- Sets table -->
			<div
				class="grid justify-between items-center"
				style:grid-template-rows={`repeat(${
					$workoutPrograms.getDefined($selectedDay).length + 1
				}, auto`}
				style:grid-template-columns={`max-content repeat(${$weekNames.size}, 1fr) max-content`}
			>
				<!-- Table header: Exercise title and week names -->
				<div class="contents text-2xl">
					<div>Exercise</div>
					{#each [...$weekNames.values()] as weekName, index}
						<div class="justify-self-center">
							<EllipsisMenu
								dynamicWidth
								inputPlaceholderText="New week name"
								on:update={(event) => model.updateWeek(weekName, event.detail)}
								on:delete={() => model.deleteWeek(weekName, index)}
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
				<div class="row-start-2 pt-3 col-span-full">
					<hr />
				</div>
			</div>

			<!-- Add exercise plan to workout day -->
			<HiddenSelectableInput
				placeholderText="Add exercise plan"
				listItems={[...$exercises.keys()]}
				listFilter={autocompleteFilter}
				on:selected={(event) => model.createExercisePlan(event.detail)}
			>
				<AddButton slot="placeholderContent" />
			</HiddenSelectableInput>
		</section>
	</HeightTransition>
</main>
