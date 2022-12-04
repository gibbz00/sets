<script lang="ts">
	import Controller from '$lib/Controller.svelte'
	import { groups, exercises, selectedDay } from '$lib/Model'
	import AddButton from './AddButton.svelte'
	import { autocompleteFilter } from '$lib/utils/autoCompleteFilter'
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
		w-max
		p-3 
		text-black 
		bg-white 
		border-2 
		border-gray-100
		rounded-sm 
		shadow-md
		border-gray 
		cursor-default
	"
>
<!-- TODO: iterate over exercise groups and remove if has clause instead of iterating over all the groups -->
	<!-- Groups -->
	<span class="space-y-2">
		{#each [...$groups.keys()] as groupName}
			{#if $exercises.getDefined(exerciseName).has(groupName)}
				<div class="text-2xl mb-1 w-fit">
					{groupName}
				</div>
				<!-- Tags for given group  -->
				<div class="flex items-center flex-wrap gap-2">
					{#each [...$exercises.getDefined(exerciseName).getDefined(groupName)] as tag}
						<div
							class="bg-green-800 p-2 rounded-sm font-medium grid place-content-center"
						>
							<EllipsisMenu
								inputPlaceholderText="Change tag name"
								inputElementClasses={{
									input: 'bg-green-800 text-white placeholder:text-gray-300',
									icon: 'fill-white',
								}}
								iconClass={{
									base: 'fill-gray-300',
									opened: 'fill-white',
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
					<!-- Add tag button -->
					<HiddenSelectableInput
						placeholderText="Add tag"
						listItems={ [...$groups.getDefined(groupName).values()]}
						listFilter={ autocompleteFilter}
						on:selected={(event) =>
							controller.createExerciseTag(event.detail.selected, groupName, exerciseName)}
					>
						<AddButton slot="placeholderContent" />
					</HiddenSelectableInput>
				</div>
			{/if}
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
            [&>button]:rounded-sm
            [&_button]:py-4
            [&_button]:w-full
            [&_input]:bg-green-800
            text-white
            font-medium
            mt-3
        "
	>
		<!-- Add group button -->
		<HiddenSelectableInput
			placeholderText="Enter group name"
			elementClasses={{
				input: 'w-full text-center placeholder:text-gray-300 pl-2 text-white',
				icon: 'fill-white',
			}}
			dynamicWidth={false}
			listItems={[...$groups.keys()]}
			listFilter={autocompleteFilter}
			listOmit={[...$exercises.getDefined(exerciseName).keys()]}
			on:selected={(event) => controller.addGroupToExercise(exerciseName, event.detail.selected)}
		>
			<button slot="placeholderContent">Add group</button>
		</HiddenSelectableInput>

		<!-- Change exercise -->
		<HiddenSelectableInput
			elementClasses={{
				input: 'w-full text-center placeholder:text-gray-300 pl-2 text-white',
				icon: 'fill-white',
			}}
			dynamicWidth={false}
			listItems={[...$exercises.keys()]}
			listFilter={autocompleteFilter}
			on:selected={(event) => controller.updatePlanExercise(event.detail.selected, exercisePlanIndex)}
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
