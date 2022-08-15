<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import { selectedDay } from '$lib/Model'
	import InteractiveList from '../InteractiveList.svelte'
	import { workoutPrograms } from '$lib/Model'
	import DropMenu from '$lib/DropMenu.svelte'
	import type { SvelteComponentTyped } from 'svelte'

	let dropMenuOpened: boolean
	type IconClass = (DropMenu extends SvelteComponentTyped<infer Props>
		? Props
		: never)['iconClass']
	let iconClass: IconClass = {
		default: 'w-16 transition-transform',
		opened: 'rotate-90',
	}
</script>

<div class="flex border-2">
	<div class="text-6xl mr-1">
		{$selectedDay}
	</div>
	<DropMenu bind:opened={dropMenuOpened} iconType="expand_more" {iconClass}>
		<svelte:fragment slot="dropMenuWindow">
			<InteractiveList
				autofocus
				on:selected={(event) => {
					$selectedDay = event.detail
					dropMenuOpened = false
				}}
				listItems={[...$workoutPrograms.keys()]}
				filterKey=""
			/>
		</svelte:fragment>
	</DropMenu>
</div>
