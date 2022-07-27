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

	import { crossfade, fade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import HoverChange from '$lib/HoverChange.svelte'
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

	/*
		Section height animaiton:
		Base on: https://css-tricks.com/using-css-transitions-auto-dimensions/

		Animation duration "requirements"
		* fadeInDelay  >= heightTransitonDuration + heightTransitionDelay, otherwise element will begin rendering before the container is fully rendered
		* heightTransitionDelay >= fadeOutDelay + fadeOutDuration, elements will otherwise remain outside of container
	*/
	// in (ms), these values to not fill requirements, all because I don't want the height transition delay be non-zero
	const heightTransitionDelay: number = 0
	const heightTransitionDuration: number = 100
	const fadeInDelay: number = 100
	const fadeInDuration: number = 100
	const fadeOutDelay: number = 0
	const fadeOutDuration: number = 100
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
	<!-- +1 to length if for the max-height to be 160 when only add button is present -->
	<section
		style:max-height={`${
			($workoutPrograms.getDefined($selectedDay).length + 1) * 160
		}px`}
		style:transition-delay={`${heightTransitionDelay}ms`}
		style:transition-duration={`${heightTransitionDuration}ms`}
		class="flex-col px-3 pt-5 text-xl transition-[max-height]"
	>
		<!-- "HACK": dynamically assigned tailwind classes don't really work since unused are removed with postcss be the svelte preprocessor -->
		<!-- 0px fist column exists so that the spacing won't change upon exercise name width change -->
		<div
			class="grid justify-between text-center gap-y-3"
			style:grid-template-columns={`0px repeat(${$weekNames.size}, max-content)`}
		>
			<!-- table header -->
			<div class="text-2xl contents">
				<div class="text-left w-min">Exercise</div>
				<WeekNames />
			</div>

			<!-- table header horizontal rule -->

			<div class="col-span-full">
				<hr />
			</div>

			<!-- table rows -->
			{#each $workoutPrograms.getDefined($selectedDay) as { exerciseName, sets }, index}
				<!-- exercise names column -->
				<!-- scoping groups with tailwind-scoped-groups package -->
				<button
					class="relative flex col-start-1 text-left min-w-max max-w-56 group-one"
					in:fade={{
						delay: fadeInDelay,
						duration: fadeInDuration,
					}}
					out:fade={{
						delay: fadeOutDelay,
						duration: fadeOutDuration,
					}}
				>
					<span class="truncate">{exerciseName}</span>
					<Icon
						type="arrowRight"
						cls="
							fill-gray-500 
							w-8 
							h-8 
							shrink-0 
							group-one-hover:fill-black  
							group-one-focus-within:fill-black 
							group-one-focus-within:rotate-180 
							transition-transform
						"
					/>
					<!-- Popup -->
					<!-- TODO: make clickable drawer: -->
					<div
						class="
							absolute 
							top-0 
							left-full
							z-10 
							p-3 
							text-black 
							bg-white 
							border-2 
							rounded-sm 
							shadow-sm 
							w-max 
							group-one-focus-within:inline 
							border-gray 
							cursor-default
						"
					>
						<!-- group names -->
						<span class="space-y-2">
							{#each [...$groups.keys()] as groupName}
								<div class="text-xl mb-1">
									{groupName}
								</div>
								<div class="flex">
									{#if $exercises
										.getDefined(exerciseName)
										.has(groupName)}
										<!-- <EditableTags
											{exerciseName}
											{groupName}
										/> -->
										<span class="space-x-1 flex">
											{#each [...$exercises
													.getDefined(exerciseName)
													.getDefined(groupName)] as tag}
												<!-- Asymetrical horizontal padding of HoverChange provoked by positioning of the elippsis -->
												<div
													class="bg-green-800 py-1 pl-2 pr-4 rounded-xl font-medium"
												>
													<HoverChange
														updatePlaceholder="Change tag name"
														iconColor={{
															default:
																'fill-gray-100',
															hover: 'fill-white',
														}}
														on:update={(event) =>
															model.updateTag(
																groupName,
																tag,
																event.detail
															)}
														on:delete={() =>
															model.deleteExerciseTag(
																exerciseName,
																groupName,
																tag
															)}
													>
														<div
															class="w-max my-auto text-white"
														>
															{tag}
														</div>
													</HoverChange>
												</div>
											{/each}
										</span>
									{/if}
									<HiddenAutoCompleteSelector
										data={Array.from(
											$groups
												.getDefined(groupName)
												.values()
										)}
										placeholder="Add tag"
										on:selected={(event) =>
											model.createExerciseTag(
												event.detail,
												groupName,
												exerciseName
											)}
									>
										<button
											class="pl-2 align-middle text-2xl"
											slot="placeholder"
										>
											+
										</button>
									</HiddenAutoCompleteSelector>
								</div>
							{/each}
						</span>
						<div
							class="
							flex
							flex-col
							[&_button]:bg-green-800
							[&_button]:px-2
							[&_button]:rounded-sm
							[&_button]:py-4
							text-white
							font-medium
							mt-3
						"
						>
							<!-- Add group button -->
							<HiddenAutoCompleteSelector
								placeholder="Enter group name"
								on:selected={(event) =>
									model.createGroup(event.detail)}
							>
								<button
									class="hover:bg-green-900 mb-2"
									slot="placeholder">Add group</button
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
								<button
									class="hover:bg-green-900 mb-2"
									slot="placeholder">Change exercise</button
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
								class="hover:bg-green-900"
							>
								Delete exercise plan
							</button>
						</div>
					</div>
				</button>

				<!-- sets grid -->
				<!-- Last sets should self align left due to add for proper add week button placement -->
				{#each sets as set, index}
					<div
						in:fade={{
							delay: fadeInDelay,
							duration: fadeInDuration,
						}}
						out:fade={{
							delay: fadeOutDelay,
							duration: fadeOutDuration,
						}}
					>
						<SetNumberInput
							justify={index != sets.length - 1
								? 'justify-center'
								: 'justify-start'}
							bind:set
						/>
					</div>
				{/each}
			{/each}
			<!-- Add exercise plan row -->
			<HiddenAutoCompleteSelector
				placeholder="Add exercise plan"
				data={Array.from($exercises.keys())}
				on:selected={(event) => model.createExercisePlan(event.detail)}
			>
				<button slot="placeholder">+</button>
			</HiddenAutoCompleteSelector>
		</div>
	</section>
</main>
