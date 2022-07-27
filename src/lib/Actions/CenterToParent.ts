export function centerToParent(
	node: HTMLElement,
	absoluteInputPositioning: boolean
) {
	if (absoluteInputPositioning) {
		node.style.transform = `translateX(${node.clientWidth / -2}px)`
		node.addEventListener('input', () => {
			node.style.transform = `translateX(${node.clientWidth / -2}px)`
		})
	}
}
