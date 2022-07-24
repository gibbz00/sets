<script lang="ts">
	import WeekNames from '$lib/WeekNames.svelte'
	import {
		weekNames,
		groups,
		workoutPrograms,
		exercises,
		selectedDay,
	} from '$lib/Stores'
	import Model from '$lib/Model.svelte'
	import HiddenAutoCompleteSelector from '$lib/HiddenAutoCompleteSelector.svelte'
	import EditableTags from '$lib/EditableTags.svelte'
	import SetNumberInput from '$lib/SetNumberInput.svelte'
	import Icon from '$lib/Icon.svelte'

	import { crossfade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
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

	let model: Model
</script>

<Model bind:this={model} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set planner</h1>
	<a
		class="flex py-3 px-4 justify-around items-center bg-green-800 rounded-xl"
		href="/analysis"
	>
		<span class="text-2xl text-white font-medium h-min">Set analysis</span>
		<span class="w-8 h-8">
			<Icon cls="fill-white" type="arrowRightAlt" />
		</span>
	</a>
</header>

<main class="shadow-lg pb-5 rounded-md">
	<nav class="flex bg-slate-50 text-2xl text-center">
		{#each [...$workoutPrograms.keys()] as weekday (weekday)}
			<div
				class="flex flex-col hover:bg-slate-100 w-full"
				on:click={() => {
					$selectedDay = weekday
				}}
			>
				<div class="py-5">{weekday}</div>
				{#if $selectedDay == weekday}
					<div
						in:receive={{ key: weekday }}
						out:send={{ key: weekday }}
						class="h-1 bg-black"
					/>
				{/if}
			</div>
		{/each}
	</nav>
	<section class="flex-col px-3 pt-5 text-xl">
		<!-- "HACK": dynamically assigned tailwind classes don't really work since unused are removed with postcss be the svelte preprocessor -->
		<div
			class="grid justify-between text-center gap-y-3"
			style:grid-template-columns={`repeat(${
				2 + $weekNames.size
			}, max-content)`}
		>
			<!-- table header -->
			<div class="contents text-2xl">
				<div class="text-left w-min">Exercise</div>
				<WeekNames />
				<HiddenAutoCompleteSelector
					placeholder="Add week"
					on:selected={(event) => model.createWeek(event.detail)}
				>
					<div slot="placeholder" class="pr-6 w-min">+</div>
				</HiddenAutoCompleteSelector>
			</div>

			<!-- table header horizontal rule -->

			<div class="col-span-full">
				<hr />
			</div>

			<!-- table rows -->
			{#each $workoutPrograms.getDefined($selectedDay) as { exerciseName, sets }, index}
				<!-- exercise names column -->
				<!-- scoping groups with tailwind-scoped-groups package -->
				<div class="relative col-start-1 text-left w-max group-one">
					{exerciseName}
					<div
						class="absolute top-0 z-10 hidden p-3 w-max bg-slate-300 left-full group-one-hover:inline"
					>
						<!-- group names -->
						{#each [...$groups.keys()] as groupName}
							<div class="text-lg font-bold">{groupName}:</div>
							<div class="flex">
								{#if $exercises
									.getDefined(exerciseName)
									.has(groupName)}
									<EditableTags {exerciseName} {groupName} />
								{/if}
								<HiddenAutoCompleteSelector
									data={Array.from(
										$groups.getDefined(groupName).values()
									)}
									placeholder="Add tag"
									on:selected={(event) =>
										model.createExerciseTag(
											event.detail,
											groupName,
											exerciseName
										)}
								>
									<span
										class="pl-2 text-2xl font-bold"
										slot="placeholder"
									>
										+
									</span>
								</HiddenAutoCompleteSelector>
							</div>
						{/each}
						<div
							class="
								flex
								flex-col
								[&_button]:bg-blue-800
								[&_button]:p-2
								space-y-1
								mt-2
							"
						>
							<!-- Add group button -->
							<HiddenAutoCompleteSelector
								placeholder="Enter group name"
								on:selected={(event) =>
									model.createGroup(event.detail)}
							>
								<button class="w-full" slot="placeholder"
									>Add group</button
								>
							</HiddenAutoCompleteSelector>

							<!-- Change exercise -->
							<HiddenAutoCompleteSelector
								placeholder="New exercise name"
								data={Array.from($exercises.keys())}
								on:selected={(event) =>
									model.updatePlanExercise(
										event.detail,
										index
									)}
							>
								<button class="w-full" slot="placeholder"
									>Change exercise</button
								>
							</HiddenAutoCompleteSelector>

							<!-- Delete exercise -->
							<button
								on:click={() =>
									model.deleteExercisePlan(
										$selectedDay,
										exerciseName,
										index
									)}
							>
								Delete exercise plan
							</button>
						</div>
					</div>
				</div>

				<!-- sets grid -->
				{#each sets as set}
					<SetNumberInput bind:set />
				{/each}
			{/each}
		</div>
		<!-- add exercise plan row -->
		<HiddenAutoCompleteSelector
			placeholder="Add exercise plan"
			data={Array.from($exercises.keys())}
			on:selected={(event) => model.createExercisePlan(event.detail)}
		>
			<span slot="placeholder">+</span>
		</HiddenAutoCompleteSelector>
	</section>
</main>
