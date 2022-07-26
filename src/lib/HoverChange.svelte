<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import Icon from '$lib/Icon.svelte'
	let deleteDispatcher: (type: 'delete') => boolean = createEventDispatcher()
	let updateDispatcher: (type: 'update', detail: string) => boolean =
		createEventDispatcher()

	let optionsVisibility: 'none' | 'block' = 'none'
	let editing: boolean = false
	let input: string = ''
	export let updatePlaceholder: null | string
	onMount(() => {
		if (updatePlaceholder == null)
			throw new Error('Update placeholder not defined')
	})

	function optionsToggle() {
		optionsVisibility = optionsVisibility == 'block' ? 'none' : 'block'
	}

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
		optionsVisibility = 'none'
		editing = false
		input = ''
	}

	function checkSubmit(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				if (input != '') {
					updateDispatcher('update', input)
					//BUG: input is not being reset, reclickling add button shows it again
				}
				resetUI()
				break
			// BUG: won't fire
			case 'Escape':
				resetUI()
				break
		}
	}

	let textField: HTMLInputElement
	let optionWindow: HTMLElement
	let toggleButton: HTMLButtonElement

	export let inputStartLength: number = 5
</script>

<svelte:window
	on:click|capture={(event) => {
		// Close if editing and click was pressed outside of textField
		if (event.target != textField && editing) {
			resetUI()
			return
		}
		// Do not close if clicking inside of component
		else if (event.target == (textField || optionWindow)) {
			return
		}
		// do not close if clicking on toggle button and the window is not opened
		else if (event.target == toggleButton) {
			return
		} else {
			resetUI()
		}
	}}
/>

{#if editing}
	<input
		placeholder={updatePlaceholder}
		class="text-center placeholder:text-center placeholder:truncate"
		on:keydown={(event) => checkSubmit(event)}
		bind:value={input}
		bind:this={textField}
		size={input.length >= inputStartLength
			? input.length
			: inputStartLength}
	/>
{:else}
	<span class="flex px-5 group">
		<div class="relative">
			<slot />
			<div class="absolute inset-y-0 -right-6">
				<slot name="button">
					<button
						class="h-full rounded-full hover:bg-slate-100/50"
						bind:this={toggleButton}
						on:click={optionsToggle}
					>
						<!-- Pointer events for correct event.target filtering  -->
						<Icon
							cls="pointer-events-none group-hover:fill-black fill-gray-500 w-7 h-7 "
							type="more_vert"
						/>
					</button>
				</slot>
				<!-- Option window -->
				<span
					class="absolute z-10 font-normal text-black bg-white border-2 divide-y-2 rounded-sm shadow-sm border-gray divide-slate-100 left-1/2 top-1/2"
					bind:this={optionWindow}
					style:display={optionsVisibility}
				>
					<button
						class="w-full px-1 py-1 text-left hover:bg-slate-100"
						on:click={() => {
							editing = true
						}}
					>
						<slot name="edit">Edit</slot>
					</button>
					<button
						class="w-full px-1 py-1 text-left hover:bg-slate-100/50"
						on:click={() => deleteDispatcher('delete')}
					>
						<slot name="delete">Remove</slot>
					</button>
				</span>
			</div>
		</div>
		<slot name="non-relative" />
	</span>
{/if}
