<script lang="ts">
	import { onMount } from 'svelte'

	export let placeholder: string = ''
	/*
        Svelte implementation of:
        https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value

        Basic concept:
            * Create a hidden span of the same input styling and value of the input
                Input styling properties that affect the input size
                     * size
                     * font
                     * input horizontal border and padding
            * Return width of the placeholder, if there isn't any value in the input element.
            * TODO: ability to use this as an svelte action 
    */
	let inputElement: HTMLInputElement

	// HACK: otherwise there is a jitter in the with once the autosize calculation is done onMount
	let inputVisibility: 'hidden' | 'visible' = 'hidden'

	let inputWidth: Pixels | null = null
	onMount(() => {
		inputWidth = getInputWidthInPixels(inputElement)
		inputVisibility = 'visible'
	})

	type Pixels = `${number}px`

	function getInputWidthInPixels(element: HTMLInputElement): Pixels {
		const {
			font,
			borderLeftWidth,
			borderRightWidth,
			paddingLeft,
			paddingRight,
		}: CSSStyleDeclaration = window.getComputedStyle(element)

		const context: CanvasRenderingContext2D = document
			.createElement('canvas')
			.getContext('2d')!
		context.font = font

		return `${
			parseFloat(borderLeftWidth) +
			parseFloat(borderRightWidth) +
			parseFloat(paddingLeft) +
			parseFloat(paddingRight) +
			context.measureText(
				element.value == '' ? element.placeholder : element.value
			).width
		}px`
	}
</script>

<input
	type="text"
	{placeholder}
	style:visibility={inputVisibility}
	style:width={inputWidth}
	bind:this={inputElement}
	on:input={() => (inputWidth = getInputWidthInPixels(inputElement))}
/>
