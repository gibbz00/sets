//Solely used for the HiddenAutoCompleteSelector, it presumes that a button and an input exist
//TODO: create a type check and throw an error if the node type is wrong

// queryselector used instead of papameters because the button can be sent in a a prop with unknown structure
export function preserveInputPlaceholderHeight(
	node: Node,
	preserveInputPlaceholderHeight: boolean
) {
	if (preserveInputPlaceholderHeight) {
		console.log((node as HTMLElement).querySelector('button')?.clientHeight)
		let buttonHeight = (node as HTMLElement).querySelector('button')?.clientHeight
		// height added as a style attribute since the input ins't rendered
		let input: HTMLInputElement = (node as HTMLElement).querySelector('input')!
		input.style.height = `${buttonHeight}px`
	}
}
