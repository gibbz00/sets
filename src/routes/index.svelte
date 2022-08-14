<script lang="ts">
	import { workoutPrograms, selectedDay, exercises } from '$lib/Model'
	import Controller from '$lib/Controller.svelte'
	import HiddenSelectableInput from '$lib/HiddenSelectableInput.svelte'
	import AddButton from '$lib/AddButton.svelte'
	import Icon from '$lib/Icon.svelte'

	import { crossfade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	import { autocompleteFilter } from '$lib/utils/autoCompleteFilter'
	import HeightTransition from '$lib/HeightTransition.svelte'
	import SetNumberInput from '$lib/SetNumberInput.svelte'
	import DropMenu from '$lib/DropMenu.svelte'
	import ExerciseInfo from '$lib/ExerciseInfo.svelte'
	import TableTemplate from '$lib/TableTemplate.svelte'

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
</script>

<Controller bind:this={controller} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set planner</h1>
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
		href="/analysis"
	>
		<span
			class="
				text-2xl
				font-medium 
				text-white
				h-min
			"
		>
			Set analysis
		</span>
		<div class="ml-2">
			<Icon class="fill-white" type="arrowRightAlt" />
		</div>
	</a>
</header>

<main class="pb-5 rounded-md shadow-md">
	<!-- Weekday tabs -->
	<!-- h-[4.8rem set based on analysis, in which all tabs can risk being removed] -->
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
		{#each [...$workoutPrograms.keys()] as weekday (weekday)}
			<div
				class="
					flex 
					flex-col 
					justify-center 
					w-full 
					hover:bg-slate-100
				"
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
	<HeightTransition maxHeight={($workoutPrograms.getDefined($selectedDay).length + 1) * 110}>
		<section class="mx-4 pt-5">
			<TableTemplate>
				<svelte:fragment slot="headerColumnOne">Exercise</svelte:fragment>
				<svelte:fragment slot="body">
					{#each $workoutPrograms.getDefined($selectedDay) as { exerciseName, sets }, index}
						<div class="contents">
							<div class="col-start-1">
								<DropMenu
									iconType="arrowRight"
									iconClass={{
										default: 'transition-transform',
										opened: 'rotate-180',
									}}
								>
									<div
										slot="placeholderContent"
										class="max-w-[22rem] max-w truncate"
									>
										{exerciseName}
									</div>
									<ExerciseInfo
										slot="dropMenuWindow"
										{exerciseName}
										exercisePlanIndex={index}
									/>
								</DropMenu>
							</div>
							<!-- Last sets should self align left due to add for proper add week button placement -->
							{#each sets as set}
								<div class="justify-self-center">
									<SetNumberInput bind:set />
								</div>
							{/each}
						</div>
					{/each}
					<!-- Add exercise plan to workout day -->
					<div class="col-start-1 pl-3 mt-2">
						<HiddenSelectableInput
							placeholderText="Add exercise plan"
							listItems={[...$exercises.keys()]}
							listFilter={autocompleteFilter}
							on:selected={(event) => controller.createExercisePlan(event.detail)}
						>
							<AddButton slot="placeholderContent" />
						</HiddenSelectableInput>
					</div>
				</svelte:fragment>
			</TableTemplate>
		</section>
	</HeightTransition>
</main>
