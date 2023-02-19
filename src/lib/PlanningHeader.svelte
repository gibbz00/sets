<script lang="ts">
	import { selectedDay, workoutPrograms} from '$lib/Model'
	import InteractiveList from './InteractiveList.svelte'
	import PopMenu from '$lib/PopMenu.svelte'
	import { getInputWidthInPixels } from './utils/dynamicInputWidth'
	import type { SvelteComponentTyped } from 'svelte'
	import { afterUpdate } from 'svelte'

	let popMenuOpened: boolean
	type IconClass = (PopMenu extends SvelteComponentTyped<infer Props>
		? Props
		: never)['iconClass']
	let iconClass: IconClass = {
		base: 'w-[4.5rem]',
		opened: 'rotate-90',
	}

	// Required since for the cases when $selectedDay is changed
	afterUpdate(() => {
		input.style.width = getInputWidthInPixels(input)
	})

	let input: HTMLInputElement
	function inputHandler(event: Event) {
		// getting undefined is not declared when binding directly to input
		$workoutPrograms.getDefined($selectedDay).description = (
			event.target as HTMLInputElement
		).value
		input.style.width = getInputWidthInPixels(input)
	}
</script>

<div class="flex flex-col">
	<div class="flex">
		<div class="text-6xl mr-1">
			{$selectedDay}
		</div>
		<PopMenu bind:opened={popMenuOpened} iconType="expand_more" {iconClass}>
			<svelte:fragment slot="popMenuWindow">
				<InteractiveList
					on:selected={(event) => {
						$selectedDay = event.detail.selected
						popMenuOpened = false
					}}
					listOptions={ {items: [...$workoutPrograms.keys()]}}
				/>
			</svelte:fragment>
		</PopMenu>
	</div>

	<!-- <textarea can't verical allign text -->
	<!-- IMPROVEMENT: change this component out with a headless ui textfield,
		 using contenteditable="true" requires so much extra tweaking
	-->
	<!-- BUG? text area placeholder content is not autoscolled -->
	<input
		bind:this={input}
		value={$workoutPrograms.getDefined($selectedDay).description}
		on:input={(event) => inputHandler(event)}
		placeholder="Add a workout description"
		class="text-2xl mt-4 resize-none focus:outline-none border-2 border-green-900/0 focus:border-green-900/100 hover:border-green-900/100"
	/>
</div>
