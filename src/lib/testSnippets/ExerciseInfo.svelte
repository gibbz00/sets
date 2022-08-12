<script lang="ts">
	import Model from '$lib/Controller.svelte'
	import { groups, exercises, selectedDay } from '$lib/Model'
	import AddButton from './AddButton.svelte'
	import { autocompleteFilter } from './autoCompleteFilter'
	import EllipsisMenu from './EllipsisMenu.svelte'
	import HiddenSelectableInput from './HiddenSelectableInput.svelte'

	export let exerciseName: string
	export let exercisePlanIndex: number

	let model: Model
</script>

<Model bind:this={model} />

<div
	id="drop-right-menu"
	class="
	max-w-sm 
	w-max
            p-3 
            text-black 
            bg-white 
            border-2 
            rounded-sm 
            shadow-sm 
            border-gray 
            cursor-default
        "
>
	<!-- Groups -->
	<span class="space-y-2">
		{#each [...$groups.keys()] as groupName}
			<div class="text-2xl mb-1 w-fit">
				{groupName}
			</div>
			<!-- Tags for given group  -->
			<div class="flex flex-wrap gap-2">
				{#if $exercises.getDefined(exerciseName).has(groupName)}
					{#each [...$exercises.getDefined(exerciseName).getDefined(groupName)] as tag}
						<!-- Asymetrical horizontal padding of HoverChange provoked by positioning of the elippsis -->
						<div class="bg-green-800 py-1 px-2 rounded-md font-medium">
							<EllipsisMenu
								inputPlaceholderText="Change tag name"
								iconClass={{
									disabled: 'fill-white',
									enabled: 'fill-green-500',
									groupHover: 'group-hover:fill-red-500',
								}}
								dynamicWidth
								absoluteEllipsisPositioning={false}
								on:update={(event) => model.updateTag(groupName, tag, event.detail)}
								on:delete={() =>
									model.deleteExerciseTag(exerciseName, groupName, tag)}
							>
								<div class="text-white pl-2" slot="placeholderContent">{tag}</div>
							</EllipsisMenu>
						</div>
					{/each}
				{/if}
				<!-- Add tag button -->
				<HiddenSelectableInput
					placeholderText="Add tag"
					listItems={[...$groups.getDefined(groupName).values()]}
					listFilter={autocompleteFilter}
					on:selected={(event) =>
						model.createExerciseTag(event.detail, groupName, exerciseName)}
				>
					<AddButton slot="placeholderContent" />
				</HiddenSelectableInput>
			</div>
		{/each}
	</span>

	<!-- Exercice plan options -->
	<div
		id="exercisePlanOptions"
		class="
            flex
            flex-col
            space-y-2
            [&_button]:bg-green-800
            [&_button:hover]:bg-green-900
            [&_button]:px-2
            [&_button]:rounded-sm
            [&_button]:py-4
            [&_*]:w-full
            text-white
            font-medium
            mt-3
        "
	>
		<!-- Add group button -->
		<HiddenSelectableInput
			placeholderText="Enter group name"
			on:selected={(event) => model.createGroup(event.detail)}
		>
			<button slot="placeholderContent">Add group</button>
		</HiddenSelectableInput>

		<!-- Change exercise -->
		<HiddenSelectableInput
			listItems={[...$exercises.keys()]}
			listFilter={autocompleteFilter}
			on:selected={(event) => model.updatePlanExercise(event.detail, exercisePlanIndex)}
			placeholderText="New exercise name"
			on:selected={(event) => model.createGroup(event.detail)}
		>
			<button slot="placeholderContent">Change exercise</button>
		</HiddenSelectableInput>

		<!-- Delete exercise -->
		<button
			on:click={() => model.deleteExercisePlan($selectedDay, exerciseName, exercisePlanIndex)}
		>
			Delete exercise plan
		</button>
	</div>
</div>
