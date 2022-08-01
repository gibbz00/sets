<script lang="ts">
	import Icon from '$lib/Icon.svelte'

	export let updatePlaceholder: null | string
	//TODO: typeset to tailwind colors
	export let iconColor: { default: string; hover: string } = {
		default: 'fill-gray-500',
		hover: 'fill-black',
	}
	export let absoluteInputPositioning: boolean = false
	export let inputStyling: string = ''
	export let dynamicInputWidth: boolean = true

	let deleteDispatcher: (type: 'delete') => boolean = createEventDispatcher()
	let updateDispatcher: (type: 'update', detail: string) => boolean = createEventDispatcher()

	let optionsVisibility: 'none' | 'block' = 'none'
	let editing: boolean = false
	let input: string = ''
	onMount(() => {
		if (updatePlaceholder == null) throw new Error('Update placeholder not defined')
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
</script>

<!-- Keydown listened on window so that there isn't a requirement for the input to be focused -->
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
	on:keydown={(event) => {
		if (editing) checkSubmit(event)
	}}
/>

{#if editing}
	<!-- Input positioned absolute in order to not break the original flow of the parent componentent -->
	<!-- style transform used as aciton for it to run onMount-->
	<div class="relative">
		<input
			autofocus
			placeholder={updatePlaceholder}
			class={`
				px-2 text-center placeholder:text-center placeholder:truncate 
				${absoluteInputPositioning ? 'absolute inset-y-0 ' : ' '}
				${inputStyling}
			`}
			use:inputWidthAutoResize={dynamicInputWidth}
			use:centerToParent={absoluteInputPositioning}
			bind:value={input}
			bind:this={textField}
		/>
	</div>
{:else}
	<span class="flex mx-auto px-5 group">
		<div class="relative flex">
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
							cls={'pointer-events-none w-7 h-7' +
								`group-hover:${iconColor.hover} ${iconColor.default}`}
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
