//TODO: typeset this
// Will only work on ul of HiddeonAutoCompleteSelector

export function offsetFromInput(node: HTMLElement) {
	// Uses getBoudingClientRect().height instead of clientHeight since the latter does not takes borders into account
	node.style.top = `${
		node.parentElement!.querySelector('input')!.getBoundingClientRect().height
	}px`
}
