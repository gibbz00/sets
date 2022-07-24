<script lang="ts">
	import Icon from '$lib/Icon.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	let deleteDispatcher: (type: 'delete') => boolean = createEventDispatcher()
	let updateDispatcher: (type: 'update', detail: string) => boolean = createEventDispatcher()

	let editing: boolean = false
	let input: string = ''
	export let updatePlaceholder: null | string
	onMount(() => {
		if (updatePlaceholder == null) throw new Error('Upate placeholder not defined')
	})

	//TODO: proper tying
	export let svgClass: string

	//Pressing edit changes both slot and change button to input text
	// This input text should have much of the same functionality as the input in autocomplete
	// TODO: make this logic an action
	// Escape cancels
	// Clicking outside cancels
	// Enter:
	// if input is empty, resets ui
	// if input is non-empty
	// dispatch change event and resets ui
	function resetUI() {
		editing = false
		input = ''
	}

	function checkSubmit(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				if (input != '') {
					updateDispatcher('update', input)
				}
				resetUI()
				break
			// BUG: this fires on firefox but not on chrome
			case 'Escape':
				resetUI()
				break
		}
	}
</script>

<svelte:window
	on:click={() => {
		if (editing) resetUI()
	}}
/>

<span class="group-two">
	<span class="group-two-hover:hidden" style:display={editing ? 'none' : ''}>
		<slot name="placeholder" />
	</span>
	<span class="hidden" style:display={editing ? 'inline-block' : 'none'}>
		<input
			on:keydown={(event) => checkSubmit(event)}
			on:click|stopPropagation
			bind:value={input}
			class="text-black"
			type="text"
			size={input.length || 13}
		/>
	</span>
	<span class="hidden group-two-hover:flex">
		<div class="contents" style:display={editing ? 'none' : ''}>
			<!-- Pen -->
			<span class="w-7 h-7" on:click|stopPropagation={() => (editing = true)}>
				<Icon cls={svgClass} type="edit" />
			</span>
			<!-- Bin -->
			<span class="w-7 h-7" on:click={() => deleteDispatcher('delete')}>
				<Icon cls={svgClass} type="delete" />
			</span>
		</div>
	</span>
</span>
