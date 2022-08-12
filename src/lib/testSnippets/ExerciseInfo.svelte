<script lang="ts">
	import Controller from '$lib/Controller.svelte'
	import { groups, exercises, selectedDay } from '$lib/Model'
	import AddButton from './AddButton.svelte'
	import { autocompleteFilter } from './autoCompleteFilter'
	import EllipsisMenu from './EllipsisMenu.svelte'
	import HiddenSelectableInput from './HiddenSelectableInput.svelte'

	export let exerciseName: string
	export let exercisePlanIndex: number

	let controller: Controller
</script>

<Controller bind:this={controller} />

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
			<div class="flex items-center flex-wrap gap-2">
				{#if $exercises.getDefined(exerciseName).has(groupName)}
					{#each [...$exercises.getDefined(exerciseName).getDefined(groupName)] as tag}
						<div
							class="bg-green-800 p-2 rounded-sm font-medium grid place-content-center"
						>
							<EllipsisMenu
								inputPlaceholderText="Change tag name"
								inputClass="bg-green-800 text-white placeholder:text-gray-300"
								inputIconClass="fill-white"
								iconClass={{
									disabled: 'fill-gray-300',
									enabled: 'fill-white',
									groupHover: 'group-hover:fill-white',
								}}
								dynamicWidth
								absoluteEllipsisPositioning={false}
								on:update={(event) =>
									controller.updateTag(groupName, tag, event.detail)}
								on:delete={() =>
									controller.deleteExerciseTag(exerciseName, groupName, tag)}
							>
								<div class="text-white pl-2 text-center" slot="placeholderContent">
									{tag}
								</div>
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
						controller.createExerciseTag(event.detail, groupName, exerciseName)}
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
			grow-0
            space-y-2
            [&_button]:bg-green-800
            [&_button:hover]:bg-green-900
            [&_button]:px-2
            [&>button]:rounded-sm
            [&_button]:py-4
            [&_button]:w-full
            text-white
            font-medium
            mt-3
        "
	>
		<!-- Add group button -->
		<HiddenSelectableInput
			placeholderText="Enter group name"
			iconClass="fill-white"
			dynamicWidth={false}
			inputClass="text-center bg-green-800 placeholder:text-gray-300 pl-2 text-white"
			on:selected={(event) => controller.createGroup(event.detail)}
		>
			<button slot="placeholderContent">Add group</button>
		</HiddenSelectableInput>

		<!-- Change exercise -->
		<HiddenSelectableInput
			iconClass="fill-white"
			inputClass="text-center bg-green-800 placeholder:text-gray-300 pl-2 text-white"
			dynamicWidth={false}
			listItems={[...$exercises.keys()]}
			listFilter={autocompleteFilter}
			on:selected={(event) => controller.updatePlanExercise(event.detail, exercisePlanIndex)}
			placeholderText="New exercise name"
		>
			<button slot="placeholderContent">Change exercise</button>
		</HiddenSelectableInput>

		<!-- Delete exercise -->
		<button
			on:click={() =>
				controller.deleteExercisePlan($selectedDay, exerciseName, exercisePlanIndex)}
		>
			Delete exercise plan
		</button>
	</div>
</div>
