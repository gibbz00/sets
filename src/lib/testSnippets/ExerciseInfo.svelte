<script lang="ts">
	import Model from '$lib/Model.svelte'
	import { groups, exercises, selectedDay } from '$lib/Stores'
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
            min-w-[40rem]
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
			<div class="text-2xl mb-1">
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
								dynamicWidth
								absoluteEllipsisPositioning={false}
								on:update={(event) => model.updateTag(groupName, tag, event.detail)}
								on:delete={() =>
									model.deleteExerciseTag(exerciseName, groupName, tag)}
							>
								<svelte:fragment slot="placeholderContent">{tag}</svelte:fragment>
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
            space-x-2
            [button]:bg-green-800
            [button:hover]:bg-green-900
            [button]:px-2
            [button]:rounded-sm
            [button]:py-4
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
