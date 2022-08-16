<script context="module">
	export const prerender = true
</script>

<script lang="ts">
	import AddButton from '$lib/AddButton.svelte'
	import AppTemplate from '$lib/AppTemplate.svelte'
	import Controller from '$lib/Controller.svelte'
	import DropMenu from '$lib/DropMenu.svelte'
	import ExerciseInfo from '$lib/ExerciseInfo.svelte'
	import HiddenSelectableInput from '$lib/HiddenSelectableInput.svelte'
	import SetNumberInput from '$lib/SetNumberInput.svelte'
	import TableTemplate from '$lib/TableTemplate.svelte'
	import { workoutPrograms, selectedDay, exercises } from '$lib/Model'
	import { autocompleteFilter } from '$lib/utils/autoCompleteFilter'
	import PlanningHeader from '$lib/PlanningHeader.svelte'

	let controller: Controller
</script>

<Controller bind:this={controller} />

<AppTemplate
	content={{
		redirectPlaceholder: 'Set Analysis',
		redirectRef: '/analysis',
		heightTransitionMultiplier: $workoutPrograms.getDefined($selectedDay).exercises.length + 2,
	}}
>
	<svelte:fragment slot="header">
		<PlanningHeader />
	</svelte:fragment>

	<svelte:fragment slot="main-section">
		<TableTemplate>
			<svelte:fragment slot="headerColumnOne">Exercise</svelte:fragment>
			<svelte:fragment slot="body">
				{#each $workoutPrograms.getDefined($selectedDay).exercises as { exerciseName, sets }, index}
					<div class="contents">
						<div class="col-start-1">
							<DropMenu
								fadeTransition
								iconType="arrowRight"
								iconClass={{
									default: 'transition-transform',
									opened: 'rotate-180',
								}}
							>
								<div slot="placeholderContent" class="max-w-[22rem] max-w truncate">
									{exerciseName}
								</div>
								<ExerciseInfo
									slot="dropMenuWindow"
									{exerciseName}
									exercisePlanIndex={index}
								/>
							</DropMenu>
						</div>
						{#each sets as set}
							<div class="justify-self-center">
								<SetNumberInput bind:set />
							</div>
						{/each}
					</div>
				{/each}
			</svelte:fragment>
			<!-- Add exercise plan to workout day -->
			<div slot="footer" class="col-start-1 pl-3 mt-2">
				<HiddenSelectableInput
					placeholderText="Add exercise plan"
					elementClasses={{
						list: 'w-min',
					}}
					listItems={[...$exercises.keys()]}
					listFilter={autocompleteFilter}
					on:selected={(event) => controller.createExercisePlan(event.detail)}
				>
					<AddButton slot="placeholderContent" />
				</HiddenSelectableInput>
			</div>
		</TableTemplate>
	</svelte:fragment>
</AppTemplate>
