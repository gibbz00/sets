<script lang="ts">
	import AddButton from '$lib/AddButton.svelte'
	import AppTemplate from '$lib/AppTemplate.svelte'
	import Controller from '$lib/Controller.svelte'
	import PopMenu from '$lib/PopMenu.svelte'
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
				{#each $workoutPrograms.getDefined($selectedDay).exercises as exerciseEntry, index (exerciseEntry)}
					<div class="contents">
						<div class="col-start-1">
							<div class="max-w-max">
								<PopMenu
									fadeTransition
									iconType="arrowRight"
									iconClass={{
										opened: 'rotate-180',
									}}
								>
									<div slot="placeholderContent" class="max-w-[22rem] ml-3 my-1 truncate">
										{exerciseEntry.exerciseName}
									</div>
									<ExerciseInfo
										slot="popMenuWindow"
										exerciseName={exerciseEntry.exerciseName}
										exercisePlanIndex={index}
									/>
								</PopMenu>
							</div>
						</div>
						{#each exerciseEntry.sets as set}
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
					on:selected={(event) => controller.createExercisePlan(event.detail.selected)}
				>
					<AddButton slot="placeholderContent" />
				</HiddenSelectableInput>
			</div>
		</TableTemplate>
	</svelte:fragment>
</AppTemplate>
