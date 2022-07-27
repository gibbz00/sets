<script lang="ts">
	import { fade } from 'svelte/transition'
	import Icon from '$lib/Icon.svelte'
	import { selectedDay, groups, exercises } from '$lib/Stores'
	import Model from '$lib/Model.svelte'
	import HoverChange from './HoverChange.svelte'
	import HiddenAutoCompleteSelector from './HiddenAutoCompleteSelector.svelte'

	export let exerciseName: string
	export let index: number

	let opened: boolean = false

	//Duplicated from index.svelte, move them into a globals object or something
	const fadeInDelay: number = 100
	const fadeInDuration: number = 100
	const fadeOutDelay: number = 0
	const fadeOutDuration: number = 100

	let model: Model
	let dropRightContainer: HTMLDivElement

	function open() {
		opened = true
	}
	function close() {
		opened = false
	}
	function toogleOpen() {
		opened = !opened
	}

	function closeIfOutSideOfDropRight(event: Event) {
		let target = event.target as Node
		let openedDialogs: (HTMLDialogElement | undefined)[] = Array.from(
			document.querySelectorAll('dialog')
		).filter((dialog: HTMLDialogElement) => {
			if (dialog.open == true) return dialog
		})

		if (
			// Don't run before dropRight container is even opened
			dropRightContainer != undefined &&
			// Don't runt if clicked inside of dropRight container
			!dropRightContainer.contains(target) &&
			// Don't run if the click comes from a modal
			// (dropRightContainer should not close if clicking for example a confirmation modal)
			openedDialogs.length == 0 &&
			// Only run if the unless the menu is actually opened, otherwise it won't be possible to open in in the first place
			opened
		) {
			close()
		}
	}

	// See closeIfOutSideOfDropRigth() for descriptions of the conditions
	function handleKeyPress(event: KeyboardEvent) {
		let openedDialogs: (HTMLDialogElement | undefined)[] = Array.from(
			document.querySelectorAll('dialog')
		).filter((dialog: HTMLDialogElement) => {
			if (dialog.open == true) return dialog
		})

		if (
			event.key == 'Escape' &&
			opened &&
			openedDialogs.length == 0 &&
			// should not be triggered if there are inputs present in the dropright
			document.querySelectorAll("#drop-right-menu input[type='text']").length == 0
		) {
			close()
		}
	}
</script>

<Model bind:this={model} />
<svelte:window
	on:click|capture={(event) => {
		// close if click was outside of dropright
		// external function since ts is not supported in svelte template area
		closeIfOutSideOfDropRight(event)
	}}
	on:keydown={(event) => {
		// sent to script since no typescript support  :/
		handleKeyPress(event)
	}}
/>

<!-- exercise names column -->
<!-- scoping groups with tailwind-scoped-groups package -->
<button
	class="relative flex col-start-1 text-left min-w-max max-w-56 group-one"
	on:click={() => {
		if (!opened) {
			open()
		}
	}}
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
		cls={`fill-gray-500 w-8 h-8 shrink-0 group-one-hover:fill-black  transition-transform ${
			opened ? 'rotate-180 fill-black' : ''
		}`}
	/>
	<!-- dropright -->
	{#if opened}
		<div
			id="drop-right-menu"
			bind:this={dropRightContainer}
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
						{#if $exercises.getDefined(exerciseName).has(groupName)}
							<!-- <EditableTags
										{exerciseName}
										{groupName}
									/> -->
							<span class="space-x-1 flex mr-2">
								{#each [...$exercises
										.getDefined(exerciseName)
										.getDefined(groupName)] as tag}
									<!-- Asymetrical horizontal padding of HoverChange provoked by positioning of the elippsis -->
									<div class="bg-green-800 py-1 pl-2 pr-4 rounded-xl font-medium">
										<HoverChange
											updatePlaceholder="Change tag name"
											inputStyling="bg-green-800 text-white placeholder:text-gray-300 border-2 border-yellow-500"
											iconColor={{
												default: 'fill-gray-100',
												hover: 'fill-white',
											}}
											on:update={(event) =>
												model.updateTag(groupName, tag, event.detail)}
											on:delete={() =>
												model.deleteExerciseTag(
													exerciseName,
													groupName,
													tag
												)}
										>
											<div class="w-max my-auto text-white">
												{tag}
											</div>
										</HoverChange>
									</div>
								{/each}
							</span>
						{/if}
						<HiddenAutoCompleteSelector
							inputStyling="border-2 border-yellow-500"
							data={Array.from($groups.getDefined(groupName).values())}
							placeholder="Add tag"
							on:selected={(event) =>
								model.createExerciseTag(event.detail, groupName, exerciseName)}
						/>
					</div>
				{/each}
			</span>
			<div
				class="
						flex
						flex-col
						justify-center
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
					inputStyling="border-2 border-yellow-500 text-black mb-2 min-w-full text-center"
					placeholder="Enter group name"
					on:selected={(event) => model.createGroup(event.detail)}
				>
					<button class="hover:bg-green-900 mb-2 w-full" slot="placeholder"
						>Add group</button
					>
				</HiddenAutoCompleteSelector>

				<!-- Change exercise -->
				<HiddenAutoCompleteSelector
					inputStyling="border-2 border-yellow-500 text-black mb-2 min-w-full text-center"
					placeholder="New exercise name"
					data={Array.from($exercises.keys())}
					on:selected={(event) => model.updatePlanExercise(event.detail, index)}
				>
					<button class="hover:bg-green-900 mb-2 w-full" slot="placeholder"
						>Change exercise</button
					>
				</HiddenAutoCompleteSelector>

				<!-- Delete exercise -->
				<button
					on:click={() => model.deleteExercisePlan($selectedDay, exerciseName, index)}
					class="hover:bg-green-900"
				>
					Delete exercise plan
				</button>
			</div>
		</div>
	{/if}
</button>
