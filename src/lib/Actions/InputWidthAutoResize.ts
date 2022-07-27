/*
        Svelte action implementation of:
        https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value

		Down side of using an action instead of an component is the initial size change jitter, use the InputWidthResize component if this feature is crucial. 

        Basic concept:
            * Create a hidden span of the same input styling and value of the input
                Input styling properties that affect the input size
                     * size
                     * font
                     * input horizontal border and padding
            * Return width of the placeholder, if there isn't any value in the input element.
*/

type Pixels = `${number}px`
export function inputWidthAutoResize(inputElement: HTMLInputElement, dynamicInputWidth: boolean) {
	if (dynamicInputWidth) {
		inputElement.style.width = getInputWidthInPixels(inputElement)

		inputElement.addEventListener('input', () => {
			inputElement.style.width = getInputWidthInPixels(inputElement)
		})

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
				context.measureText(element.value == '' ? element.placeholder : element.value).width
			}px`
		}
	}
}
