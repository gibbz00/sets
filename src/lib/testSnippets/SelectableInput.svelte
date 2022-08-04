<script lang="ts">
	import Icon from '$lib/Icon.svelte'

	/*
        Add a clickable arrow beside input element for mouse/tap driven users

        * Option to have automatic width based on current input,
            see InputWidthAutoResize.ts action
        * Option to set input to be of absolute positioning,
            see CenterToParent.ts action
        * Ability to pass down inputStyles as prop
        * Option to add a selectable list, used for autocompletes

        Tests:
            * Selected event can be dispatches by
                 * Pressing enter (done)
                * Clicking arrow icon (done)
            * Selected event can be listened to on parent component (done)
    */

	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import type { SelectedEvent } from './Events'

	export let textFieldValue: string = ''
	export let placeholderText: string = ''
	let selectedDispatcher: SelectedEvent = createEventDispatcher()

	// List is rendered absolute and must be offset relative to the dynamic inputHeight
	let inputContainer: HTMLDivElement
	let list: HTMLDivElement
	onMount(() => {
		if ($$slots.list) {
			list.style.top = `${inputContainer.getBoundingClientRect().height}px`
		}
	})
</script>

<div bind:this={inputContainer} class="relative w-min">
	<div
		class="
            w-max
            flex
            border-2
            border-gray-500/20
            focus-within:border-blue-500
        "
		on:keydown={(event) => {
			if (event.key == 'Enter') {
				selectedDispatcher('selected', textFieldValue)
			}
		}}
	>
		<!--
            ORDER MATTERS!!!
                * bind:value must come before on:input
                    * otherwise on:input will use old value
        -->
		<input
			class="focus-visible:outline-none"
			type="text"
			placeholder={placeholderText}
			bind:value={textFieldValue}
			on:input
		/>
		<button
			on:click={() => {
				selectedDispatcher('selected', textFieldValue)
			}}
		>
			<Icon type="arrowRightAlt" />
		</button>
	</div>
	{#if $$slots.list}
		<div bind:this={list} class="absolute z-10 inset-x-0 min-w-max ">
			<slot name="list" />
		</div>
	{/if}
</div>
