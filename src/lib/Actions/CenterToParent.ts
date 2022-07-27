export function centerToParent(node: HTMLElement) {
	node.style.transform = `translateX(${node.clientWidth / -2}px)`
	node.addEventListener('input', () => {
		node.style.transform = `translateX(${node.clientWidth / -2}px)`
	})
}
