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
		console.log('ran x')
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
</script>

<svelte:window
	on:click|capture={(event) => {
		console.log(event.target)
		// Close if editing and click was pressed outside of textField
		if (event.target != textField && editing) {
			resetUI()
			return
		}
		// Do not close if clicking inside of component
		else if (event.target == (textField || optionWindow)) {
			console.log('ran z')
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
		class="placeholder:text-center placeholder:truncate"
		on:keydown={(event) => checkSubmit(event)}
		bind:value={input}
		bind:this={textField}
		size={input.length || 13}
	/>
{:else}
	<span class="group relative px-5">
		<div class="truncate">
			<slot />
		</div>
		<div class="absolute right-0 inset-y-0">
			<slot name="button">
				<button bind:this={toggleButton} on:click={optionsToggle}>
					<!-- Pointer events for correct event.target filtering  -->
					<Icon
						cls="pointer-events-none group-hover:fill-black fill-gray-500 w-7 h-7 "
						type="more_vert"
					/>
				</button>
			</slot>
		</div>
		<span
			class="absolute left-full w-screen top-0 z-10 bg-white/30 py-2 backdrop-blur-sm px-4 text-xl text-left"
			bind:this={optionWindow}
			style:display={optionsVisibility}
		>
			<button
				on:click={() => {
					editing = true
				}}
			>
				<slot name="edit">Edit</slot>
			</button>
			<hr />
			<button on:click={() => deleteDispatcher('delete')}>
				<slot name="delete">Remove</slot>
			</button>
		</span>
	</span>
{/if}
