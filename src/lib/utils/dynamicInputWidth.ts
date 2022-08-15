/*
        Svelte action implementation of:
        https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value

		Usage:
			Bind input to input element and add this to component script tag:
				let input: HTMLInputElement
				// Null scenario can occur when component is destroyed
				// Throws error unless checked for
				afterUpdate(() => {
					if(input != null)
						input.style.width = getInputWidthInPixels(input)
						}
				})

		This assures that the width is changed for those cases when no input event is emitted, 
			which is the case for every time the property is set programatically.
		Would be nice to have this as an action, but I could not find any way to listen to a property 
			withouth adding more than the use:action directive in the svelte component, for those aforementioned cases.
		I tried using MutationOberver and listening to the value attribute, 
				but it's not changed when using the bind:value directive.
		Most minimal option I found was to have a MutationObserver placed in the action which listens to an added a placeholder attribute
				e.g valueX=vale as attribute in the input element
		

        Basic concept:
            * Create a hidden span of the same input styling and value of the input
                Input styling properties that affect the input size
                     * size
                     * font
                     * input horizontal border and padding
            * Return width of the placeholder, if there isn't any value in the input element.
*/

type Pixels = `${number}px`

export function getInputWidthInPixels(element: HTMLInputElement): Pixels {
	const {
		font,
		borderLeftWidth,
		borderRightWidth,
		paddingLeft,
		paddingRight,
	}: CSSStyleDeclaration = window.getComputedStyle(element)

	const context: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d')!
	context.font = font
	return `${
		parseFloat(borderLeftWidth) +
		parseFloat(borderRightWidth) +
		parseFloat(paddingLeft) +
		parseFloat(paddingRight) +
		context.measureText(element.value == '' ? element.placeholder : element.value).width
	}px`
}
